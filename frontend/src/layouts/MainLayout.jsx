import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import useIsMobile from "../hooks/useIsMobile";
import { Home, Dumbbell, TrendingUp, Trophy, MessageCircle } from "lucide-react";
import CoachModeBanner from "../components/CoachModeBanner";

const MainLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();

  const navItems = [
    { to: "/dashboard", icon: <Home />, label: "Home" },
    { to: "/routines1", icon: <Dumbbell />, label: "Rutinas" },
    { to: "/progress", icon: <TrendingUp />, label: "Progreso" },
    { to: "/leaderboard", icon: <Trophy />, label: "Clasificacion" },
    { to: "/checkout", icon: <MessageCircle />, label: "Chat" },
  ];

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-background flex">
        <CoachModeBanner />
        <aside className="w-60 shrink-0 bg-background border-r border-text-low/20 flex flex-col fixed h-full z-40">
          <div className="px-6 py-6 border-b border-text-low/20">
            <div className="flex items-center gap-3">
              <div className="bg-accent1 h-10 w-10 rounded-xl flex items-center justify-center font-heading font-extrabold text-[20px] text-text-high">F</div>
              <span className="font-heading font-extrabold text-[20px] text-text-high">FYLIOS</span>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-subheading font-bold text-[14px] transition-all ${
                    isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-text-low hover:bg-surf hover:text-text-high"
                  }`}>
                  <span className="text-[18px]">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="ml-60 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <CoachModeBanner />
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-text-low/20 z-50">
        <div className="flex flex-row justify-around p-2 pb-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} className="flex flex-col items-center gap-1 p-2">
                <span className={`text-xl ${isActive ? "text-primary" : "text-text-low"}`}>{item.icon}</span>
                <span className={`text-xs font-medium ${isActive ? "text-primary" : "text-text-low"}`}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;