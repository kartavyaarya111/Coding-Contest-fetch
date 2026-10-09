import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { fetchPlatformContests } from "../api/contests";
import ContestSection from "../components/ContestSection";
import { platforms } from "../data/platforms";
import type { ContestGroup } from "../types/contest";

function PlatformPage() {
  const { platformId } = useParams<{ platformId: string }>();
  const [contests, setContests] = useState<ContestGroup>({
    live: [],
    upcoming: [],
    past: [],
  });

  const platform = platforms.find((item) => item.id === platformId);

  useEffect(() => {
    if (!platformId || !platform) {
      return;
    }

    const loadContests = async () => {
      const result = await fetchPlatformContests(platformId);
      setContests(result);
    };

    loadContests();
  }, [platformId, platform]);

  if (!platformId || !platform) {
    return <Navigate to="/contest" replace />;
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10">
      <h1 className="mt-8 text-center text-4xl font-bold text-white sm:text-5xl">
        {platform.name} Contests
      </h1>

      <ContestSection
        title={`Live ${platform.name} Contests`}
        contests={contests.live}
      />

      <ContestSection
        title={`Upcoming ${platform.name} Contests`}
        contests={contests.upcoming}
      />

      <ContestSection
        title={`Past ${platform.name} Contests [Last 30 Days]`}
        contests={contests.past}
      />
    </main>
  );
}

export default PlatformPage;
