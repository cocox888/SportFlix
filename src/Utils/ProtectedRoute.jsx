import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useDataLayerValue } from "../Datalayer/DataLayer";

function ProtectedRoute() {
  const [{ loggedIn }, dispatch] = useDataLayerValue();
  return loggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;
