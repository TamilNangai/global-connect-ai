import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, BarChart3, Settings, Menu, X, ChevronLeft, LogOut,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import logo from "@/assets/unispeak-logo.png";

const sidebarLinks = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const { signOut, user } = useAuth();

  const pageTitle = sidebarLinks.find(l => location.pathname === l.to)?.label || "Admin";

  const SidebarContent = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2 min-w-0">
          <img src={logo} alt="UniSpeak AI" className="w-8 h-8 object-contain shrink-0" />
          {(sidebarOpen || mobile) && (
            <span className="font-bold text-foreground text-sm truncate">UniSpeak AI</span>
          )}
        </Link>
        {mobile && (
          <button onClick={() => setMobileSidebarOpen(false)} className="ml-auto p-1 rounded hover:bg-muted/50">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => mobile && setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-royal/10 text-royal shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <link.icon className="w-5 h-5 shrink-0" />
              {(sidebarOpen || mobile) && <span>{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        {(sidebarOpen || mobile) && user && (
          <div className="px-3 py-2 text-xs text-muted-foreground truncate">
            {user.email}
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {(sidebarOpen || mobile) && <span>Sign Out</span>}
        </button>
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 shrink-0" />
          {(sidebarOpen || mobile) && <span>Back to site</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="hidden md:flex flex-col border-r border-border bg-card shrink-0 overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      <AnimatePresence>
        {mobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-64 bg-card border-r border-border shadow-elevated md:hidden"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border bg-card/80 backdrop-blur-sm flex items-center px-4 gap-3 shrink-0 sticky top-0 z-30">
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setMobileSidebarOpen(true);
              } else {
                setSidebarOpen(!sidebarOpen);
              }
            }}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="text-sm font-semibold text-foreground">{pageTitle}</div>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
