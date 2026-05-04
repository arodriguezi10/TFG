import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: "🏠", label: "Home" },
    { to: "/routines1", icon: "📋", label: "Rutinas" },
    { to: "/progress",  icon: "📊", label: "Progreso" },
    { to: "/checkout",  icon: "💬", label: "Chat" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-text-low/20 z-50">
        <div className="flex flex-row justify-around p-2 pb-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-1 p-2"
              >
                <span className={`text-xl ${isActive ? "opacity-100" : "opacity-40"}`}>
                  {item.icon}
                </span>
                <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-text-low"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;