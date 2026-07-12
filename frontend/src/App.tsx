import { useState } from "react";
import HomePage from "./pages/HomePage";
import PlatformPage from "./pages/PlatformPage";

function App() {
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(
    null
  );

  if (selectedPlatformId) {
    return (
      <PlatformPage
        platformId={selectedPlatformId}
        onBack={() => setSelectedPlatformId(null)}
      />
    );
  }

  return <HomePage onSelectPlatform={setSelectedPlatformId} />;
}

export default App;
