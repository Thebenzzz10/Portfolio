import React from "https://esm.sh/react@18.3.1";
import { createRoot } from "https://esm.sh/react-dom@18.3.1/client";
import App from "./pages/App.jsx";

function hideBoot() {
  const boot = document.getElementById("boot");
  if (boot) boot.remove();
}

const root = createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If we got here, the app mounted and we can remove fallback UI.
hideBoot();
