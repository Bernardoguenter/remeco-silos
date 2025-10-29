import { getPreferences } from "./preferences";

let preferencesCache: any = null;
let lastFetch = 0;
const TTL = 1000 * 60 * 5;

export async function getGlobalPreferences() {
  const now = Date.now();
  if (!preferencesCache || now - lastFetch > TTL) {
    preferencesCache = await getPreferences();
    lastFetch = now;
  }
  return preferencesCache;
}
