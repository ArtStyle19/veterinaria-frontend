import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import type { JSX } from 'react';

interface Props {
  roles?: ('ADMIN' | 'VET' | 'PET_OWNER')[];
  children: JSX.Element;
}

export default function ProtectedRoute({ roles, children }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  /* 1. Mientras no sabemos -> spinner */
  if (loading) return <div className="p-8 text-center">Verificando sesión…</div>;

  /* 2. No logueado */
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  /* 3. Rol no autorizado */
  if (roles && !roles.includes(user.roleName))
    return <Navigate to="/" replace />;

  /* 4. Todo bien */
  return children;
}
