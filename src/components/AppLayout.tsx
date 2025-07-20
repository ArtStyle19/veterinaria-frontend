// import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
// import { useAuth } from '../auth/AuthContext';
// import { useEffect } from 'react';

// export default function AppLayout() {
//   const { user, setUser } = useAuth();
//   const navigate = useNavigate();

//   /** cierra sesión limpiando token y estado */
//   function logout() {
//     localStorage.removeItem('jwt');
//     setUser(null);
//     navigate('/login');
//   }

//   /** si se pierde sesión por otra pestaña */
//   useEffect(() => {
//     if (!localStorage.getItem('jwt')) setUser(null);
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col">
//       {/* ---------- NAV ---------- */}
//       <nav className="bg-slate-800 text-white px-6 py-3 flex justify-between">
//         <div className="flex items-center gap-6">
//           <Link to="/" className="font-bold">
//             Central-Vet
//           </Link>

//           {/* enlaces comunes */}
//           <NavLink to="/" className="hover:text-amber-300">
//             Inicio
//           </NavLink>

//           {/* enlaces condicionales */}
//           {user?.roleName === 'PET_OWNER' && (
//             <NavLink to="/pets" className="hover:text-amber-300">
//               Mis mascotas
//             </NavLink>
//           )}
//           {user?.roleName === 'VET' && (
//             <>
//               <NavLink to="/pets" className="hover:text-amber-300">
//                 Pacientes
//               </NavLink>
//               <NavLink to="/clinics/me" className="hover:text-amber-300">
//                 Clínica
//               </NavLink>
//             </>
//           )}
//           {user?.roleName === 'ADMIN' && (
//             <>
//             <NavLink to="/clinics" className="hover:text-amber-300">
//               Clínicas
//             </NavLink>
//             <NavLink to="/vets/new" className="hover:text-amber-300">
//   Nuevo vet
// </NavLink>

//             </>
//           )}

//         </div>

//         {/* perfil / logout */}
//         <div className="flex items-center gap-4">
//           <span className="hidden sm:block text-sm">
//             {user?.username} ({user?.roleName})
//           </span>
//           <button
//             onClick={logout}
//             className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
//           >
//             Salir
//           </button>
//         </div>
//       </nav>

//       {/* ---------- CONTENIDO ---------- */}
//       <main className="flex-1 p-6 bg-slate-50">
//         <Outlet />
//       </main>

//       {/* ---------- FOOTER ---------- */}
//       <footer className="text-center text-xs py-4 text-slate-600">
//         © {new Date().getFullYear()} Central-Vet
//       </footer>
//     </div>
//   );
// }

import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useEffect, useRef, useState } from 'react';
import { LogOut, LogIn } from 'lucide-react';

const fullHeightPages = ['/dashboard'];
const isFullHeight = fullHeightPages.includes(location.pathname);

///

///
/**
 * "MainLayout" — layout único que se comporta dinámicamente según
 *  - Visitante sin sesión → sólo muestra enlaces públicos
 *  - Usuario logueado (ADMIN | VET | PET_OWNER) → enlaces según rol
 *
 *  Glassmorphism: fondo degradado + tarjetas translucidas + blur.
 */
export default function MainLayout() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /* --------- helpers --------- */
  function logout() {
    localStorage.removeItem('jwt');
    setUser(null);
    navigate('/login');
  }

  /* Si el token se elimina en otra pestaña */
  useEffect(() => {
    if (!localStorage.getItem('jwt')) setUser(null);
  }, [location.pathname]);

  /* --------- shared links --------- */
  const PublicLinks = (
    <>
      <NavLink to="/" className="nav-link">
        Inicio
      </NavLink>
      <NavLink to="/qr" className="nav-link">
        Buscar mascota
      </NavLink>
    </>
  );

  const OwnerLinks = (
    <NavLink to="/pets" className="nav-link">
      Mis mascotas
    </NavLink>
  );

  const VetLinks = (
    <>
      <NavLink to="/pets" className="nav-link">
        Pacientes
      </NavLink>
      <NavLink to="/clinics/me" className="nav-link">
        Clínica
      </NavLink>
      {/* <NavLink to="/predict" className="hover:text-amber-300">
        Predictor
      </NavLink> */}
    </>
  );

  const AdminLinks = (
    <>
      <NavLink to="/clinics" className="nav-link">
        Clínicas
      </NavLink>
      <NavLink to="/vets/new" className="nav-link">
        Nuevo vet
      </NavLink>
      <NavLink to="admin/stats/global" className="nav-link">
        Gestionar
      </NavLink>
    </>
  );

  return (
    // <div className="flex flex-col min-h-screen"></div>
    <div className="min-h-screen flex flex-col bg-gradient-to-bl from-blue-950 via-black to-violet-950 text-slate-100">
      {/* ---------- NAV ---------- */}
      <nav className="backdrop-blur-md bg-white/3 border-b border-white/10 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          {/* brand */}
          <Link to="/" className="font-bold text-lg tracking-wide">
            🐾 Central‑Vet
          </Link>

          {/* links */}
          <div className="flex items-center gap-6 text-sm">
            {PublicLinks}
            {user?.roleName === 'PET_OWNER' && OwnerLinks}
            {user?.roleName === 'VET' && VetLinks}
            {user?.roleName === 'ADMIN' && AdminLinks}
          </div>

          {/* perfil / logout (solo logueado) */}
          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 bg-violet-600/40 border-white/50 border-1 hover:bg-blue-600/0 hover:border-white hover:border-1 transition px-3 py-1 rounded-full text-xs shadow-md"
            >
              <LogOut size={14} /> Salir
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-1 bg-blue-700/30 border-white/50 border-1 hover:bg-blue-600/0 hover:border-white hover:border-1 transition px-3 py-1 text-xs rounded-full shadow-md"
            >
              <LogIn size={14} /> Iniciar Sesion
            </Link>
          )}
        </div>
      </nav>
      <main className="flex-1 flex justify-center px-4 py-8 overflow-hidden">
        <div
          className={`w-full max-w-7xl p-6 ${
            isFullHeight
              ? 'h-full min-h-[calc(100vh-160px)]'
              : 'overflow-y-auto min-h-[calc(100vh)] max-h-[calc(100vh-160px)] rounded-2xl backdrop-blur-md bg-white/3 border border-white/10 shadow-xl'
          }`}
        >
          <Outlet />
        </div>
      </main>

      {/* ---------- FOOTER ---------- */}
      <footer className="text-center text-xs py-6 text-slate-100 backdrop-blur-md bg-white/3 border-t border-white/10">
        © {new Date().getFullYear()} Central‑Vet — Todos los derechos
        reservados
      </footer>
    </div>
  );
}

/* ---------- Tailwind helper ---------- */
// tailwind.config.js → theme.extend => {
//   boxShadow: {
//     glass: '0 4px 30px rgba(0,0,0,0.1)',
//   },
// }
// Y en globals: .nav-link { @apply hover:text-amber-300 transition-colors; }
/* --- componente interno que llama /clinics para listar  --- */
