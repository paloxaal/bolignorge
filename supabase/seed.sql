-- ============================================================================
-- Bolig Norge — Optional seed data
-- ============================================================================
-- Run this AFTER schema.sql to insert example reports for testing.
-- Skip in production, or replace with real reports.
-- file_path values must match actual files uploaded to the 'reports' bucket.
-- ============================================================================

insert into public.reports (title, summary, kind, period, file_path, published_at)
values
  (
    'Q1 2026 — Kvartalsrapport',
    'Status på aktive prosjekter, finansiell utvikling og strategiske veivalg.',
    'Kvartalsrapport',
    'Q1 2026',
    'kvartalsrapporter/2026-q1.pdf',
    '2026-04-15 10:00:00+02'
  ),
  (
    'Årsrapport 2025',
    'Komplett gjennomgang av regnskapsåret 2025 med konsernregnskap og styrets beretning.',
    'Årsrapport',
    '2025',
    'arsrapporter/arsrapport-2025.pdf',
    '2026-03-20 09:00:00+01'
  ),
  (
    'Styreprotokoll — Februar 2026',
    'Vedtak fra styremøte 14. februar 2026.',
    'Styremøte',
    '14. feb 2026',
    'styremoter/2026-02-14-protokoll.pdf',
    '2026-02-15 14:00:00+01'
  );
