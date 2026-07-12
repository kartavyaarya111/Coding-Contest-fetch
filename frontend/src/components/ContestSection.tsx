import ContestCard from "./ContestCard";
import type { Contest } from "../types/contest";

function ContestSection({
  title,
  contests,
}: {
  title: string;
  contests: Contest[];
}) {
  return (
    <section className="mt-10">
      <h2 className="text-2xl font-semibold text-white">{title}</h2>

      <div className="mt-4 grid gap-4">
        {contests.length > 0 ? (
          contests.map((contest) => (
            <ContestCard key={contest.titleSlug} contest={contest} />
          ))
        ) : (
          <div className="rounded-lg border border-dashed border-slate-700 bg-slate-900/50 p-4 text-slate-400">
            No contests available
          </div>
        )}
      </div>
    </section>
  );
}

export default ContestSection;
