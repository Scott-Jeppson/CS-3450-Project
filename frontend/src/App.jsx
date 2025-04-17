import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home          from "./Pages/Home.jsx";
import SignIn        from "./Pages/SignIn.jsx";
import CreateAccount from "./Pages/CreateAccount.jsx";
import Dashboard     from "./Pages/Dashboard.jsx";
import Sumo          from "./Pages/Sumo.jsx";
import { API_BASE_URL } from "./constants";

const ProtectedRoute = ({ isLoggedIn, children }) =>
  isLoggedIn ? children : <Navigate to="/signin" replace />;

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch(
          `${API_BASE_URL}/api/is_logged_in`,
          { method: "GET", credentials: "include" }
        );
        const { logged_in } = await resp.json();
        setIsLoggedIn(logged_in);
      } catch (err) {
        console.error(err);
        setIsLoggedIn(false);
      }
    })();
  }, []);

  if (isLoggedIn === null) return <div>Loading…</div>;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          index
          element={
            <Home
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="signin"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <SignIn
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
          }
        />
        <Route
          path="createaccount"
          element={
            isLoggedIn
              ? <Navigate to="/dashboard" replace />
              : <CreateAccount
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
          }
        />

        <Route
          path="dashboard"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Dashboard
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="sumo"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Sumo
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;