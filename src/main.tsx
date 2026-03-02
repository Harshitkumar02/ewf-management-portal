import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initDB } from "./lib/db";

initDB();

createRoot(document.getElementById("root")!).render(<App />);
