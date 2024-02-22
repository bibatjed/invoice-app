import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserRegistration from "@src/pages/UserRegistration";
import Login from "@src/pages/Login";
import Home from "@src/pages/Home";
import UserContextProvider from "@src/context/UserContext";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <UserRegistration />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
]);

export default function App() {
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
    </UserContextProvider>
  );
}
