import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { DiagnosticApp } from "./app/DiagnosticApp";
import "./styles/diagnostic.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DiagnosticApp />
  </StrictMode>,
);
