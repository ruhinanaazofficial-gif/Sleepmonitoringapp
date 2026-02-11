import { Outlet, NavLink } from "react-router";
import { Moon, ClipboardList, Activity, Calendar } from "lucide-react";

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Moon className="w-8 h-8 text-indigo-400" />
            <h1 className="text-2xl font-semibold">Sleep Monitor</h1>
          </div>
        </div>
      </header>

      <nav className="border-b border-slate-800 bg-slate-900/30">
        <div className="container mx-auto px-4">
          <ul className="flex gap-1">
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`
                }
              >
                <Activity className="w-4 h-4" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/log"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`
                }
              >
                <Calendar className="w-4 h-4" />
                Sleep Log
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/routines"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`
                }
              >
                <ClipboardList className="w-4 h-4" />
                Routines
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-t-lg transition-colors ${
                    isActive
                      ? "bg-slate-800 text-indigo-300"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`
                }
              >
                <Activity className="w-4 h-4" />
                Analytics
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
