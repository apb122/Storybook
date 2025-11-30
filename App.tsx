import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { ProjectWorkspacePage } from "./pages/ProjectWorkspacePage";
import "./index.css";

/**
 * Root application component
 * Sets up routing and renders the main app layout
 */
export function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="project/:projectId" element={<ProjectWorkspacePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
