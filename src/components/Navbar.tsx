import { authClient } from "@/lib/auth-client";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserButton } from "@daveyplate/better-auth-ui";
import api from "@/configs/axios";
import { toast } from "sonner";
import { Home, Folder, Users, CreditCard, Menu } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [credits, setCredits] = useState(0);
  const { data: session } = authClient.useSession();

  const getCredits = async () => {
    try {
      const { data } = await api.get("/api/user/credits");
      setCredits(data.credits);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (session?.user) {
      getCredits();
    }
  }, [session?.user]);

  const NavIcon = ({
    to,
    label,
    Icon,
  }: {
    to: string;
    label: string;
    Icon: any;
  }) => {
    const active = location.pathname === to;

    return (
      <Link
        to={to}
        className="relative group flex flex-col items-center overflow-visible"
      >
        <div
          className={`
            p-2 rounded-full transition-all duration-300
            ${
              active
                ? "bg-indigo-500/10 dark:bg-cyan-500/20"
                : "hover:bg-slate-200/60 dark:hover:bg-white/10"
            }
          `}
        >
          <Icon
            size={20}
            className={`
              transition-all duration-300
              ${
                active
                  ? "text-indigo-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(79,70,229,0.6)] dark:drop-shadow-[0_0_10px_rgba(34,211,238,0.9)]"
                  : "text-slate-600 dark:text-slate-400 group-hover:text-indigo-500 dark:group-hover:text-cyan-400"
              }
            `}
          />
        </div>

        {/* Tooltip */}
        <div
          className="
            absolute -bottom-12 left-1/2 -translate-x-1/2
            px-3 py-1.5 text-xs rounded-md
            bg-white text-indigo-600
            dark:bg-black dark:text-cyan-300
            opacity-0 scale-90
            group-hover:opacity-100 group-hover:scale-100
            transition-all duration-300
            pointer-events-none
            whitespace-nowrap
            z-[9999]
            shadow-[0_0_15px_rgba(79,70,229,0.3)]
            dark:shadow-[0_0_20px_rgba(34,211,238,1)]
            border border-indigo-200 dark:border-cyan-400/40
            backdrop-blur
          "
        >
          {label}
        </div>
      </Link>
    );
  };

  return (
    <>
      <nav
        className=" cyber-glass
          overflow-visible
          relative
          z-50 flex items-center justify-between w-full
          py-3 px-4 md:px-16 lg:px-24 xl:px-32
          backdrop-blur border-b
          bg-white/80 dark:bg-[#0B0F1A]/60
          border-slate-200 dark:border-white/10
          text-[#0F172A] dark:text-slate-100
        "
      >
        {/* LOGO */}
        <Link to="/" className="cyber-logo glitch">
          <span data-text="SmartSite" className="glitch-text">
            SmartSite
          </span>
          <span className="cyber-logo-ai">AI</span>
        </Link>

        {/* ICON MENU */}
        <div className="hidden md:flex items-center gap-6 overflow-visible">
          <NavIcon to="/" label="Home" Icon={Home} />
          <NavIcon to="/projects" label="My Projects" Icon={Folder} />
          <NavIcon to="/community" label="Community" Icon={Users} />
          <NavIcon to="/pricing" label="Pricing" Icon={CreditCard} />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {!session?.user ? (
            <button
              onClick={() => navigate("/auth/signin")}
              className="
                px-6 py-2 rounded-md font-medium text-white
                bg-gradient-to-r from-indigo-600 to-blue-600
                hover:from-indigo-500 hover:to-blue-500
                shadow-[0_0_12px_rgba(79,70,229,0.4)]
                transition-all
              "
            >
              Get started
            </button>
          ) : (
            <>
              <button className="bg-indigo-50 dark:bg-white/10 px-4 py-1.5 text-xs border border-indigo-200 dark:border-white/10 rounded-full text-indigo-600 dark:text-cyan-400">
                Credits: <span className="ml-1">{credits}</span>
              </button>
              <UserButton size="icon" />
            </>
          )}

          <button
            className="md:hidden p-2 rounded-md border border-slate-200 dark:border-white/20"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>
        </div>
      </nav>

      {/* MOBILE */}
      {menuOpen && (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-black flex flex-col items-center justify-center gap-8 text-indigo-600 dark:text-cyan-400">
          <Link onClick={() => setMenuOpen(false)} to="/">
            Home
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/projects">
            My Projects
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/community">
            Community
          </Link>
          <Link onClick={() => setMenuOpen(false)} to="/pricing">
            Pricing
          </Link>

          <button
            onClick={() => setMenuOpen(false)}
            className="mt-6 size-10 rounded-md bg-indigo-600 text-white dark:bg-white dark:text-black"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
