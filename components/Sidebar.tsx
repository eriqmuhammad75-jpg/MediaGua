"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Beranda & Materi", href: "/", icon: "home" },
    { name: "Simulasi Atmosfer", href: "/simulator", icon: "map" },
    { name: "LKPD Digital", href: "/worksheet", icon: "dataset" },
    { name: "Cuaca Real-time", href: "/realtime", icon: "cloud" },
    { name: "Kuis", href: "/quiz", icon: "quiz" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex bg-surface-container-low/30 backdrop-blur-2xl h-screen sticky left-0 top-0 w-[280px] border-r border-white/15 shadow-2xl flex-col gap-2 p-4 transition-all duration-300 z-50">
        <div className="flex items-center gap-4 mb-8 px-2 mt-4">
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shadow-[0_0_10px_#00F2FF]">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display-lg text-headline-md text-primary-fixed drop-shadow-[0_0_8px_#74f5ff]">Laboratorium</span>
            <span className="font-label-md text-caption text-primary-fixed-dim">Atmosfer</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 flex-grow">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-secondary-container/40 text-secondary-fixed shadow-[0_0_15px_rgba(110,32,140,0.3)] border-l-4 border-primary-container"
                    : "text-on-surface-variant hover:bg-primary-container/10 hover:text-primary-fixed-dim hover:scale-[1.02] active:scale-95"
                }`}
              >
                <span className="material-symbols-outlined">{link.icon}</span>
                <span className="font-label-md text-label-md">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full glass-panel border-t border-white/10 p-2 flex justify-around items-center z-50">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex flex-col items-center p-2 ${
                isActive ? "text-primary-fixed" : "text-on-surface-variant hover:text-primary-fixed-dim"
              }`}
            >
              <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{link.icon}</span>
              <span className="font-caption text-[10px] mt-1 text-center">{link.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
