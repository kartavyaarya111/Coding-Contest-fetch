import type { ContestGroup } from "../types/contest";

const emptyContestGroup: ContestGroup = {
  live: [],
  upcoming: [],
  past: [],
};

const CACHE_TTL_MS = 30_000;
const contestCache = new Map<
  string,
  { data: ContestGroup; timestamp: number }
>();
const pendingRequests = new Map<string, Promise<ContestGroup>>();

export async function fetchPlatformContests(
  platformId: string
): Promise<ContestGroup> {
  const cached = contestCache.get(platformId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const pendingRequest = pendingRequests.get(platformId);

  if (pendingRequest) {
    return pendingRequest;
  }

  const request = fetch(`http://localhost:5000/contests/${platformId}`)
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      contestCache.set(platformId, {
        data: result,
        timestamp: Date.now(),
      });

      return result;
    })
    .catch((error) => {
      console.error(`Error fetching ${platformId} contests:`, error);
      return emptyContestGroup;
    })
    .finally(() => {
      pendingRequests.delete(platformId);
    });

  pendingRequests.set(platformId, request);
  return request;
}
