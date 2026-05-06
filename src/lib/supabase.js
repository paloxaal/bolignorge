// src/lib/supabase.js
//
// Supabase-klient for Bolig Norge dashboard.
//
// VIKTIG: noOpLock-workaround under.
// Supabase-js bruker som default navigator.locks (LockManager API) til å
// koordinere token-refresh på tvers av tabs/vinduer. Lock-en kan bli "held"
// for evig hvis en annen tab krasjer, ble bakgrunnet, eller hadde en
// uavsluttet auth-call — da henger ALLE auth-kall i alle åpne tabs/browsere
// til lock-en utløper (eller for evig om det ikke er timeout).
//
// Symptom hos oss: admin/styreportal henger på lasting når man er innlogget
// i en annen browser, eller åpner i ny browser.
//
// Workaround: gi Supabase en no-op lock-funksjon. Da gjøres ingen
// cross-tab koordinering — i sjeldne tilfeller kan to tabs refreshe token
// parallelt, men det er en akseptabel tradeoff for et lite admin-dashboard.
//
// Referanser:
//   https://github.com/supabase/supabase-js/issues/1594
//   https://github.com/supabase/supabase-js/issues/2013
//   https://github.com/supabase/supabase-js/issues/2111

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "[supabase] Mangler VITE_SUPABASE_URL eller VITE_SUPABASE_ANON_KEY i env."
  );
}

const noOpLock = async (_name, _acquireTimeout, fn) => fn();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    lock: noOpLock,
  },
});
