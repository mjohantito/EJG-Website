import { supabase } from './supabase';

const SHEET_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SHEET_SCRIPT_URL;

/**
 * Submit an inquiry to Supabase (inquiries table) and Google Apps Script
 * (which writes to Google Sheet + sends email to halo@ehjadiga.com).
 */
export async function submitInquiry(kind, data) {
  const payload = {
    kind,
    name: data.name,
    email: data.email,
    wa: data.wa,
    data,
  };

  // 1. Save to Supabase
  const { error } = await supabase.from('inquiries').insert(payload);
  if (error) console.error('Supabase insert error:', error);

  // 2. Send to Google Sheets + email via Apps Script
  if (SHEET_SCRIPT_URL && SHEET_SCRIPT_URL !== 'PASTE_YOUR_APPS_SCRIPT_URL_HERE') {
    try {
      await fetch(SHEET_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kind, ...data, timestamp: new Date().toISOString() }),
      });
    } catch (e) {
      console.error('Sheet submission error:', e);
    }
  }
}
