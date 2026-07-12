import { useEffect, useState } from "react";
import { fetchPlatformContests } from "../api/contests";
import ContestSection from "../components/ContestSection";
import { platforms } from "../data/platforms";
import type { ContestGroup } from "../types/contest";

function PlatformPage({
  platformId,
  onBack,
}: {
  platformId: string;
  onBack: () => void;
}) {
  const [contests, setContests] = useState<ContestGroup>({
    live: [],
    upcoming: [],
    past: [],
  });

  const platform = platforms.find((item) => item.id === platformId);

  useEffect(() => {
    const loadContests = async () => {
      const result = await fetchPlatformContests(platformId);
      setContests(result);
    };

    loadContests();
  }, [platformId]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10">
      <button
        type="button"
        onClick={onBack}
        className="rounded-md border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-amber-400 hover:text-amber-300"
      >
        Back
      </button>

      <h1 className="mt-8 text-4xl font-bold text-white sm:text-5xl">
        {platform?.name ?? "Platform"} Contests
      </h1>

      <ContestSection
        title={`Live ${platform?.name ?? ""} Contests`}
        contests={contests.live}
      />

      <ContestSection
        title={`Upcoming ${platform?.name ?? ""} Contests`}
        contests={contests.upcoming}
      />

      <ContestSection
        title={`Past ${platform?.name ?? ""} Contests`}
        contests={contests.past}
      />
    </main>
  );
}

export default PlatformPage;
