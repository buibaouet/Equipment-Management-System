import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { store } from "./store";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <AppWrapper>
          <App />
          <Toaster position="top-right" richColors />
        </AppWrapper>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
