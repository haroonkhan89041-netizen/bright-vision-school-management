import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import AppFull from "./AppFull";

// Keep the school management UI available even if the external Supabase
// project is temporarily unavailable. Cloud integration can be re-enabled
// after the new Supabase project is configured.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppFull />
  </StrictMode>,
);
