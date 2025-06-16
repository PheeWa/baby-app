import { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { RootState } from "../Store/store";

type AuthGuardProps = {
  children: ReactNode;
};

const AuthGuard = ({ children }: AuthGuardProps) => {
  const { user } = useSelector((state: RootState) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default AuthGuard;
