import PlatformCard from "../components/PlatformCard";
import { platforms } from "../data/platforms";

function HomePage({
  onSelectPlatform,
}: {
  onSelectPlatform: (platformId: string) => void;
}) {
  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-5 py-10">
      <h1 className="mb-10 text-center text-4xl font-bold text-white sm:text-5xl">
        Coding Contest Platforms
      </h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((platform) => (
          <PlatformCard
            key={platform.id}
            platform={platform}
            onSelect={onSelectPlatform}
          />
        ))}
      </div>
    </main>
  );
}

export default HomePage;
