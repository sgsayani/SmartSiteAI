import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import Preview from "./pages/Preview";
import Community from "./pages/Community";
import View from "./pages/View";
import Navbar from "./components/Navbar";

const App = () => {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const {pathname} = useLocation()
  const hideNavbar = pathname.startsWith('/projects/') && pathname !== '/projects' || pathname.startsWith('/view/') || pathname.startsWith('/preview/')

  return (
    <>
      {/* Theme Toggle */}
      <button
        onClick={() => setDark(!dark)}
        className="
    fixed bottom-6 right-6 z-50
    p-2 rounded-full
    bg-[#FFFFFF] dark:bg-white/10
    border border-[#E2E8F0] dark:border-white/15
    text-[#0F172A] dark:text-slate-200
    hover:shadow-md dark:hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]
    transition-all
  "
      >
        {dark ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      <div
        className="
          min-h-screen
          bg-[#F8FAFC] dark:bg-[#0B0F1A]
          text-[#0F172A] dark:text-slate-100
          transition-colors duration-300
        "
      >
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/projects/:projectId" element={<Projects />} />
          <Route path="/projects" element={<MyProjects />} />
          <Route path="/preview/:projectId" element={<Preview />} />
          <Route path="/preview/:projectId/:versionId" element={<Preview />} />
          <Route path="/community" element={<Community />} />
          <Route path="/view/:projectId" element={<View />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
