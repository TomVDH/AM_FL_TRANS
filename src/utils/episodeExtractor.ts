/**
 * Episode Number Extractor
 *
 * Extracts episode numbers from filenames for CSV export naming.
 */

/**
 * Extract episode number from filename
 *
 * Supports various formats:
 * - E01, E1, E001
 * - EP01, EP1, EP001
 * - Episode01, Episode1, Episode001
 * - Ep_01, Ep-01
 * - 01_something (leading numbers)
 *
 * @param filename - The filename to extract from
 * @returns Episode identifier (e.g., "E01") or "UNKNOWN" if no match
 *
 * @example
 * extractEpisodeNumber("E01_DialogueMain.xlsx") // returns "E01"
 * extractEpisodeNumber("Episode5_Script.xlsx") // returns "E05"
 * extractEpisodeNumber("random_file.xlsx") // returns "UNKNOWN"
 */
export function extractEpisodeNumber(filename: string): string {
  if (!filename) return 'UNKNOWN';

  // Remove file extension
  const baseName = filename.replace(/\.[^/.]+$/, '');

  // Pattern 1: E01, E1, E001 (case insensitive)
  const ePattern = /\bE(\d{1,3})\b/i;
  const eMatch = baseName.match(ePattern);
  if (eMatch) {
    return `E${eMatch[1].padStart(2, '0')}`;
  }

  // Pattern 2: EP01, EP1, EP001 (case insensitive)
  const epPattern = /\bEP(\d{1,3})\b/i;
  const epMatch = baseName.match(epPattern);
  if (epMatch) {
    return `E${epMatch[1].padStart(2, '0')}`;
  }

  // Pattern 3: Episode01, Episode1, Episode001 (case insensitive)
  const episodePattern = /\bEpisode[\s_-]?(\d{1,3})\b/i;
  const episodeMatch = baseName.match(episodePattern);
  if (episodeMatch) {
    return `E${episodeMatch[1].padStart(2, '0')}`;
  }

  // Pattern 4: Leading number like "01_something" or "1_something"
  const leadingPattern = /^(\d{1,3})[\s_-]/;
  const leadingMatch = baseName.match(leadingPattern);
  if (leadingMatch) {
    return `E${leadingMatch[1].padStart(2, '0')}`;
  }

  return 'UNKNOWN';
}
