import { Navigate, Route, Routes } from "react-router-dom";
import ContestPage from "./pages/ContestPage";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import PlatformPage from "./pages/PlatformPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/contest" element={<ContestPage />} />
      <Route path="/contest/:platformId" element={<PlatformPage />} />
      <Route path="/jobs" element={<JobsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
