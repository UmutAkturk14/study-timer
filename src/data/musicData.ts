/**
 * Replace the objects below with your own titles and YouTube URLs.
 * Only the video ID is stored, so a URL like
 *   https://www.youtube.com/watch?v=5qap5aO4i9A
 * becomes id: "5qap5aO4i9A"
 */
export interface Track {
  id: string;      // YouTube video ID
  title: string;   // What the user sees in the dropdown
}

export const musicData: Track[] = [
  { id: "bVA-I44yC98", title: "lo-fi beats (demo)" },
  { id: "6c1oP9oVZ5g", title: "cozy otter" },
];
