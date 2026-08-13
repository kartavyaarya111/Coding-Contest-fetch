import type { Contest } from "../types/contest";

function formatDuration(duration: number) {
  const totalMinutes = Math.floor( duration / 60);
  const hours = Math.floor((totalMinutes % (24*60))/60);
  const days = Math.floor(totalMinutes / (24*60));
  const minutes = totalMinutes % 60;
  const parts: string[] = [];

  if(days>0)  parts.push(`${days}d`);
  if(hours>0) parts.push(`${hours}h`);
  if(minutes>0) parts.push(`${minutes}m`);

  return parts.length ? parts.join(" ") : "0m";
}

function ContestCard({ contest }: { contest: Contest }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-center shadow-sm transition hover:border-slate-700">
      <h3 className="text-lg font-semibold text-white">{contest.title}</h3>

      <p className="mt-3 text-sm text-slate-300">
        Start Time: {new Date(contest.startTime * 1000).toLocaleString()}
      </p>

      <p className="mt-1 text-sm text-slate-300">
        Duration: {formatDuration(contest.duration)}
      </p>

      <a
        href={contest.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto mt-4 inline-flex rounded-md bg-amber-400 px-3 py-2 text-sm font-medium text-slate-950 transition hover:bg-amber-300"
      >
        Open Contest
      </a>
    </article>
  );
}

export default ContestCard;
