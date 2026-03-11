/**
 * Speaker Name Utilities
 *
 * Extracts clean speaker names from utterer strings used in game data.
 */

/**
 * Extract clean speaker name from utterer string
 *
 * Parses complex utterer strings from the game data format to extract
 * human-readable speaker names for the dialogue box display.
 *
 * @param utterer - Raw utterer string (e.g., "SAY.Sign_TheMines_Dirty.1.Dirty Sign")
 * @returns Extracted speaker name (e.g., "Dirty Sign") or fallback "Speaker"
 *
 * @example
 * extractSpeakerName("SAY.Sign_TheMines_Dirty.1.Dirty Sign") // returns "Dirty Sign"
 * extractSpeakerName("SAY.NPC_Miner.2.Old Miner") // returns "Old Miner"
 */
export function extractSpeakerName(utterer: string): string {
  if (!utterer) return 'Speaker';

  const parts = utterer.split('.');
  if (parts.length >= 4) {
    return parts.slice(3).join('.'); // Rejoin to preserve dots in names like "Mme. Derriere"
  }

  // Fallback: try to extract a meaningful name from the string
  const cleanName = utterer.replace(/^SAY\./, '').replace(/\.\d+$/, '');
  if (cleanName && cleanName !== utterer) {
    return cleanName.replace(/_/g, ' '); // Replace underscores with spaces
  }

  return 'Speaker';
}
