export const uniquePositions = [
    "Billboard",
    "Large Leaderboard",
    "Leaderboard",
    "Large Mobile Banner"
  ];
  
export function getAdStatus(start: Date, end: Date): string {
      const now = new Date();
      if (now < start) return "toPublish";
      if (now > end) return "expired";
      return "published";
  }