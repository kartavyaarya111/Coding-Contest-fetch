export interface Contest {
  title: string;
  titleSlug: string;
  startTime: number;
  duration: number;
  url: string;
  platform?: string;
}

export interface ContestGroup {
  live: Contest[];
  upcoming: Contest[];
}
