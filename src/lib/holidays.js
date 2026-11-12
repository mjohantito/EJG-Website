// Indonesian national holidays + cuti bersama 2025–2027
// Islamic holiday dates are approximate (±1 day depending on moon sighting)
const HOLIDAYS = new Set([
  // ── 2025 ──────────────────────────────────────────────────────────────────
  '2025-01-01', // Tahun Baru Masehi
  '2025-01-27', // Tahun Baru Imlek 2576 + Isra Mi'raj 1446H
  '2025-01-28', // Cuti Bersama
  '2025-03-28', // Cuti Bersama Nyepi
  '2025-03-29', // Hari Raya Nyepi - Tahun Baru Saka 1947
  '2025-03-31', // Idul Fitri 1 Syawal 1446H
  '2025-04-01', // Idul Fitri 2 Syawal 1446H
  '2025-04-02', // Cuti Bersama Idul Fitri
  '2025-04-03', // Cuti Bersama Idul Fitri
  '2025-04-04', // Cuti Bersama Idul Fitri
  '2025-04-07', // Cuti Bersama Idul Fitri
  '2025-04-18', // Wafat Yesus Kristus
  '2025-05-01', // Hari Buruh Internasional
  '2025-05-12', // Hari Raya Waisak 2569 BE
  '2025-05-13', // Cuti Bersama Waisak
  '2025-05-29', // Kenaikan Yesus Kristus
  '2025-06-01', // Hari Lahir Pancasila
  '2025-06-06', // Idul Adha 10 Dzulhijjah 1446H
  '2025-06-07', // Cuti Bersama Idul Adha
  '2025-06-27', // Tahun Baru Islam 1447H
  '2025-08-17', // HUT RI ke-80
  '2025-09-05', // Maulid Nabi Muhammad SAW
  '2025-12-25', // Hari Raya Natal
  '2025-12-26', // Cuti Bersama Natal

  // ── 2026 ──────────────────────────────────────────────────────────────────
  '2026-01-01', // Tahun Baru Masehi
  '2026-01-16', // Tahun Baru Imlek 2577
  '2026-01-17', // Cuti Bersama Imlek
  '2026-02-16', // Isra Mi'raj Nabi Muhammad 1447H
  '2026-03-19', // Hari Raya Nyepi - Tahun Baru Saka 1948
  '2026-03-20', // Idul Fitri 1 Syawal 1447H
  '2026-03-21', // Idul Fitri 2 Syawal 1447H
  '2026-03-23', // Cuti Bersama Idul Fitri
  '2026-03-24', // Cuti Bersama Idul Fitri
  '2026-03-25', // Cuti Bersama Idul Fitri
  '2026-04-03', // Wafat Yesus Kristus
  '2026-05-01', // Hari Buruh Internasional
  '2026-05-14', // Hari Raya Waisak 2570 BE + Kenaikan Yesus Kristus
  '2026-05-27', // Idul Adha 10 Dzulhijjah 1447H
  '2026-05-28', // Cuti Bersama Idul Adha
  '2026-06-01', // Hari Lahir Pancasila
  '2026-06-17', // Tahun Baru Islam 1448H
  '2026-08-17', // HUT RI ke-81
  '2026-08-26', // Maulid Nabi Muhammad SAW 1448H
  '2026-12-25', // Hari Raya Natal
  '2026-12-26', // Cuti Bersama Natal

  // ── 2027 (SKB 3 Menteri No. 1205/2026, 3/2026, 2/2026) ────────────────────
  '2027-01-01', // Tahun Baru Masehi
  '2027-01-05', // Isra Mi'raj Nabi Muhammad 1448H
  '2027-02-05', // Cuti Bersama Imlek
  '2027-02-06', // Tahun Baru Imlek 2578
  '2027-03-08', // Hari Raya Nyepi - Tahun Baru Saka 1949
  '2027-03-09', // Cuti Bersama Idul Fitri
  '2027-03-10', // Idul Fitri 1 Syawal 1448H
  '2027-03-11', // Idul Fitri 2 Syawal 1448H
  '2027-03-12', // Cuti Bersama Idul Fitri
  '2027-03-15', // Cuti Bersama Idul Fitri
  '2027-03-25', // Cuti Bersama Wafat Yesus Kristus
  '2027-03-26', // Wafat Yesus Kristus
  '2027-03-28', // Paskah
  '2027-05-01', // Hari Buruh Internasional
  '2027-05-06', // Kenaikan Yesus Kristus
  '2027-05-17', // Idul Adha 10 Dzulhijjah 1448H
  '2027-05-18', // Cuti Bersama Idul Adha
  '2027-05-19', // Cuti Bersama Waisak
  '2027-05-20', // Hari Raya Waisak 2571 BE
  '2027-06-01', // Hari Lahir Pancasila
  '2027-06-06', // Tahun Baru Islam 1449H
  '2027-08-15', // Maulid Nabi Muhammad SAW
  '2027-08-17', // HUT RI ke-82
  '2027-12-24', // Cuti Bersama Natal
  '2027-12-25', // Hari Raya Natal
  '2027-12-26', // Isra Mi'raj Nabi Muhammad 1449H
]);

function nextDayStr(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const next = new Date(y, m - 1, d + 1);
  return `${next.getFullYear()}-${String(next.getMonth() + 1).padStart(2, '0')}-${String(next.getDate()).padStart(2, '0')}`;
}

/** True if this date is a public holiday or cuti bersama */
export function isHoliday(dateStr) {
  return HOLIDAYS.has(dateStr);
}

/**
 * True if weekend pricing should apply:
 * - Friday, Saturday, or Sunday
 * - 31 December (New Year's Eve)
 * - Public holiday
 * - Day before a public holiday (D-1)
 */
export function isPeakDay(dateStr) {
  if (!dateStr) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  if (day === 0 || day === 5 || day === 6) return true; // Sun / Fri / Sat
  if (m === 12 && d === 31) return true;                // Malam Tahun Baru, every year
  if (HOLIDAYS.has(dateStr)) return true;
  if (HOLIDAYS.has(nextDayStr(dateStr))) return true;    // D-1 before holiday
  return false;
}
