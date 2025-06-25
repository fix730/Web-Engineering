import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';


interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { basicUserInfo } = useSelector((state: RootState) => state.auth);

  if (!basicUserInfo) {
    // Wenn kein basicUserInfo vorhanden ist, leite zur Login-Seite um
    return <Navigate to="/login" replace />;
  }

  // Wenn basicUserInfo vorhanden ist, zeige die Kind-Komponenten an (oder den Outlet für verschachtelte Routen)
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;