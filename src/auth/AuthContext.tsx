import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { whoAmI } from '../api/auth';
import type { UserDto } from '../types/auth';

interface JwtPayload {
  sub: string;
  role: string;
  exp: number;
}

interface AuthCtx {
  user: UserDto | null;
  loading: boolean;
  setUser: (u: UserDto | null) => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserDto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('jwt');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { sub, role, exp } = jwtDecode<JwtPayload>(token);
      if (Date.now() >= exp * 1000) throw new Error('expired');

      // valor mínimo para que ProtectedRoute no redireccione
      // setUser({ id: Number(sub), username: '', roleName: role as UserDto['roleName'] });

      // obtenemos nombre de usuario real (opcional)
      whoAmI()
        .then((me) => setUser(me))
        .catch(() => {
          localStorage.removeItem('jwt');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } catch {
      localStorage.removeItem('jwt');
      setUser(null);
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
