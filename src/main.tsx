import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import AppAuth from "./AppAuth";
import { DashboardLiveSync } from "./components/DashboardLiveSync";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppAuth />
    <DashboardLiveSync />
  </StrictMode>,
);
