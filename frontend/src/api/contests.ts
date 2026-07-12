import type { ContestGroup } from "../types/contest";

const emptyContestGroup: ContestGroup = {
  live: [],
  upcoming: [],
  past: [],
};

export async function fetchPlatformContests(
  platformId: string
): Promise<ContestGroup> {
  const response = await fetch("http://localhost:5000/contests");
  const result = await response.json();

  return result[platformId] ?? emptyContestGroup;
}
