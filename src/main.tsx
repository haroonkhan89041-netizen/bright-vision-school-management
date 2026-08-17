import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import AppAuth from "./AppAuth";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppAuth />
  </StrictMode>,
);
