import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/auth";
import { Suspense } from "react";
import LoadingBar from "./components/shared/loading-bar";
import { ToastContainer } from "react-toastify";
import Router from "./routes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingBar />}>
          <Router />
        </Suspense>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
