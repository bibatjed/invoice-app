import { useAuth } from "@src/context/UserContext";
import { ReactNode, useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props: { children: ReactNode | ReactNode[] }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate replace to="/login" />;
  }
  return props.children;
}
