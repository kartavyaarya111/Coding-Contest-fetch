import type { ContestGroup } from "../types/contest";

const emptyContestGroup: ContestGroup = {
  live: [],
  upcoming: [],
  past: [],
};

export async function fetchPlatformContests(
  platformId: string
): Promise<ContestGroup> {
  try{
    const response = await fetch(`http://localhost:5000/contests/${platformId}`);

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
    const result = await response.json();

    return result;
  }catch (error) {
    console.error(`Error fetching ${platformId} contests:`, error);
    return emptyContestGroup;
  }
}
