import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import Modal from "react-modal";
Modal.setAppElement("#root");

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
