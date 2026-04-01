import { Navigate } from "react-router";

export default function ProtectedRoute({ children }) {
  if (!localStorage.getItem("access_token")) {
    return <Navigate to="/login" />;
  }

  return children;
}
