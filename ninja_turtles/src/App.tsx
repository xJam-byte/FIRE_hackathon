import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import DashboardPage from "./pages/DashboardPage";
import TicketsPage from "./pages/TicketsPage";
import ManagersPage from "./pages/ManagersPage";
import OfficesPage from "./pages/OfficesPage";
import AssistantPage from "./pages/AssistantPage";
import AnalyticsPage from "./pages/AnalyticsPage";

export default function App() {
  return (
    <>
      {/* Noise-текстура поверх всего */}
      <div className="noise-overlay" />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/managers" element={<ManagersPage />} />
          <Route path="/offices" element={<OfficesPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/assistant" element={<AssistantPage />} />
        </Route>
      </Routes>
    </>
  );
}
