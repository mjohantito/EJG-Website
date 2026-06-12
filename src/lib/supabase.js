import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

export const MEDIA_BUCKET = 'media';

// Compress + resize to WebP before upload. Skips SVG/GIF.
function compressImage(file, maxWidth = 1400, quality = 0.82) {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') return Promise.resolve(file);
  return new Promise(resolve => {
    const img = new Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      let w = img.naturalWidth, h = img.naturalHeight;
      if (w > maxWidth) { h = Math.round(h * maxWidth / w); w = maxWidth; }
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      canvas.toBlob(blob => {
        if (!blob) { resolve(file); return; }
        const out = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' });
        resolve(out.size < file.size ? out : file);
      }, 'image/webp', quality);
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); resolve(file); };
    img.src = blobUrl;
  });
}

export async function uploadMedia(file, folder = 'covers') {
  const compressed = await compressImage(file);
  const ext = compressed.name.split('.').pop();
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, compressed, {
    upsert: false,
    contentType: compressed.type,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
