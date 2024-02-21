import { createBrowserRouter } from "react-router-dom";
import UserRegistration from "./pages/UserRegistration";
import Login from "./pages/Login";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <UserRegistration />,
  },
]);

export default router;
