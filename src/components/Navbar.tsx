import { authClient } from "@/lib/auth-client";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {UserButton} from '@daveyplate/better-auth-ui'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const {data:session} = authClient.useSession()


  return (
    <>
      {/* NAVBAR */}
      <nav
        className="
          z-50 flex items-center justify-between w-full
          py-4 px-4 md:px-16 lg:px-24 xl:px-32
          backdrop-blur border-b
          bg-[#FFFFFF]/80 dark:bg-[#0B0F1A]/60
          border-[#E2E8F0] dark:border-white/10
          text-[#0F172A] dark:text-slate-100
        "
      >
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-1 select-none">
          <span className="text-xl font-bold tracking-tight">SmartSite</span>
          <span
            className="
              text-xl font-bold
              text-[#4F46E5] dark:text-[#22D3EE]
              drop-shadow-[0_0_6px_rgba(168,85,247,0.35)]
            "
          >
            AI
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#64748B] dark:text-slate-300">
          <Link
            className="hover:text-[#4F46E5] dark:hover:text-[#22D3EE] transition"
            to="/"
          >
            Home
          </Link>
          <Link
            className="hover:text-[#4F46E5] dark:hover:text-[#22D3EE] transition"
            to="/projects"
          >
            My Projects
          </Link>
          <Link
            className="hover:text-[#4F46E5] dark:hover:text-[#22D3EE] transition"
            to="/community"
          >
            Community
          </Link>
          <Link
            className="hover:text-[#4F46E5] dark:hover:text-[#22D3EE] transition"
            to="/pricing"
          >
            Pricing
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* PRIMARY CTA */}
          {!session?.user ? (
             <button
            onClick={() => navigate("/auth/signin")}
            className="
              relative px-6 py-2 rounded-md font-medium
              text-white
              bg-gradient-to-r 
              hover:from-[#4338CA] hover:to-[#4F46E5]
              active:scale-[0.97]
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50
              dark:shadow-[0_0_18px_rgba(34,211,238,0.25)]  bg-blue-700 dark:bg-blue-600
            "
          >
            Get started
          </button>

          ) : (
            <UserButton size='icon'/>
          )
           }

          {/* Mobile menu button */}
          <button
            className="
              md:hidden p-2 rounded-md
              border border-[#E2E8F0] dark:border-white/15
              hover:bg-[#F1F5F9] dark:hover:bg-white/5
              active:scale-90 transition
            "
            onClick={() => setMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 5h16" />
              <path d="M4 12h16" />
              <path d="M4 19h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div
          className="
            fixed inset-0 z-[100]
            bg-[#F8FAFC] dark:bg-[#0B0F1A]
            text-[#0F172A] dark:text-slate-100
            flex flex-col items-center justify-center
            gap-8 text-lg
          "
        >
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

          {/* CLOSE BUTTON */}
          <button
            onClick={() => setMenuOpen(false)}
            className="
              mt-6 size-10 rounded-md font-medium
              bg-[#0F172A] text-white
              dark:bg-white dark:text-black
              hover:scale-105 transition
            "
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
