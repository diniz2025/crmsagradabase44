import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Heart, LayoutDashboard, Home } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const navItems = [
    { name: "Home", path: "Home", icon: Home },
    { name: "CRM", path: "CRM", icon: LayoutDashboard }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-gradient-to-r from-blue-900 to-green-800 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 font-bold text-xl hover:text-amber-400 transition-colors">
              <Heart className="w-6 h-6 text-amber-400" />
              Sagrada Família
            </Link>

            <div className="flex gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    currentPageName === item.path
                      ? "bg-white/20 text-white font-semibold"
                      : "text-blue-100 hover:bg-white/10"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main>{children}</main>
    </div>
  );
}