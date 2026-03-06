// src/utils/speakerCodexUtils.ts

interface CodexEntry {
  name: string;
  description: string;
  english: string;
  dutch: string;
  category?: string;
  nicknames?: string[];
  bio?: string;
  gender?: string;
  dialogueStyle?: string;
}

/**
 * Normalize a name for comparison: collapse whitespace/hyphens, lowercase
 */
function normalizeName(name: string): string {
  return name.replace(/[-_\s]+/g, ' ').trim().toLowerCase();
}

/**
 * Find a codex CHARACTER entry matching a speaker name from xlsx data.
 *
 * Matching cascade (per design doc):
 * 1. Exact match on entry.english
 * 2. Exact match on entry.name
 * 3. Nickname match
 * 4. Substring (guarded): entry.english contains speakerName, both 4+ chars
 * 5. null
 */
export function findCodexCharacter(
  speakerName: string,
  codexEntries: CodexEntry[]
): CodexEntry | null {
  if (!speakerName || !codexEntries.length) return null;

  const normalizedSpeaker = normalizeName(speakerName);

  // 1. Exact match on english
  for (const entry of codexEntries) {
    if (normalizeName(entry.english) === normalizedSpeaker) return entry;
  }

  // 2. Exact match on name (codex identifier key)
  for (const entry of codexEntries) {
    if (normalizeName(entry.name) === normalizedSpeaker) return entry;
  }

  // 3. Nickname match
  for (const entry of codexEntries) {
    const nicknames = entry.nicknames || [];
    for (const nick of nicknames) {
      if (normalizeName(nick) === normalizedSpeaker) return entry;
    }
  }

  // 4. Substring (guarded: one-direction only, both 4+ chars)
  if (normalizedSpeaker.length >= 4) {
    for (const entry of codexEntries) {
      const normalizedEnglish = normalizeName(entry.english);
      if (normalizedEnglish.length >= 4 && normalizedEnglish.includes(normalizedSpeaker)) {
        return entry;
      }
    }
  }

  // 5. No match
  return null;
}

/**
 * Detect whether a row is a system message (non-dialogue).
 *
 * Per design doc: Column B keyword check overrides Column A pattern check.
 */
export function isSystemMessage(utterer: string, contextNote: string): boolean {
  // Column B keywords override everything
  const systemKeywords = [
    'title screen', 'button text', 'menu option', 'ui',
    'description', 'item description',
  ];
  const noteLower = (contextNote || '').toLowerCase();
  for (const keyword of systemKeywords) {
    if (noteLower.includes(keyword)) return true;
  }

  // Column A: not a SAY.*.*.SpeakerName pattern
  if (!utterer) return true;
  const parts = utterer.split('.');
  if (parts.length < 4 || !parts[0].startsWith('SAY')) return true;

  return false;
}

export type { CodexEntry };
