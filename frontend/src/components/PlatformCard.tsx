import type { Platform } from "../types/platform";

function PlatformCard({
  platform,
  onSelect,
}: {
  platform: Platform;
  onSelect: (platformId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(platform.id)}
      className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-left transition hover:-translate-y-0.5 hover:border-amber-400 hover:bg-slate-900/80"
    >
      <h2 className="text-xl font-semibold text-white">{platform.name}</h2>
      <p className="mt-2 text-sm text-slate-400">{platform.description}</p>
    </button>
  );
}

export default PlatformCard;
