import {authService} from "../services/api.ts";
import {Navigate} from "react-router-dom";
import React from "react";

// https://www.robinwieruch.de/react-router-private-routes/

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;