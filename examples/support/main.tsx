import "@workers-intelligence-commons/tokens/tokens.css";
import "@workers-intelligence-commons/components/styles.css";
import "./page.css";
import { createRoot } from "react-dom/client";
import { SupportPage } from "./SupportPage.tsx";

createRoot(document.getElementById("root")!).render(<SupportPage />);
