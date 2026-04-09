import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    // En móvil es columna (contenido arriba, menú abajo). En PC (md:) es fila (menú izq, contenido der)
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-white font-sans">
      {/* 1. CONTENEDOR PRINCIPAL */}
      {/* pb-20 deja espacio abajo en móvil para que el menú no tape el texto */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <Outlet />
      </main>

      {/* 2. MENÚ DE NAVEGACIÓN */}
      {/* Móvil: fixed abajo, ocupa todo el ancho. PC (md:): relativo a la izquierda, ancho 64 */}
      <aside
        className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 
                        md:relative md:w-64 md:border-t-0 md:border-r md:flex md:flex-col md:p-6 z-50"
      >
        {/* Título de la App (Oculto en móvil, visible en PC) */}
        <div className="hidden md:block mb-10">
          <h1 className="text-2xl font-black text-blue-500 tracking-wider">
            FYLIOS
          </h1>
        </div>

        {/* Botones de navegación (Fila en móvil, Columna en PC) */}
        <nav className="flex flex-row justify-around p-2 md:flex-col md:p-0 md:space-y-4">
          <Link
            to="/dashboard"
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 text-slate-400 hover:text-white"
          >
            <span className="text-xl">🏠</span>
            <span className="text-xs md:text-base font-medium">Panel</span>
          </Link>
          <Link
            to="/routines"
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 text-slate-400 hover:text-white"
          >
            <span className="text-xl">&</span>
            <span className="text-xs md:text-base font-medium">Rutinas</span>
          </Link>
          <Link
            to="/"
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 text-slate-400 hover:text-white"
          >
            <span className="text-xl">📊</span>
            <span className="text-xs md:text-base font-medium">Progreso</span>
          </Link>
          <Link
            to="/checkout"
            className="flex flex-col md:flex-row items-center gap-1 md:gap-3 p-2 text-slate-400 hover:text-white"
          >
            <span className="text-xl">💳</span>
            <span className="text-xs md:text-base font-medium">Chat</span>
          </Link>
        </nav>
      </aside>
    </div>
  );
};

export default MainLayout;
