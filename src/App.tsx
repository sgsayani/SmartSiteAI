import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
// import CyberThemeToggle from "./components/CyberThemeToggle";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import Projects from "./pages/Projects";
import MyProjects from "./pages/MyProjects";
import Preview from "./pages/Preview";
import Community from "./pages/Community";
import View from "./pages/View";
import Navbar from "./components/Navbar";
import { Toaster } from "sonner";
import AuthPage from "./pages/auth/AuthPage";
import Settings from "./pages/Settings";
import CyberCursorGlow from "./components/CyberCursorGlow ";
import Loading from "./pages/Loading";

const App = () => {
  const [dark, setDark] = useState(false);

  // useEffect(() => {
  //   const saved = localStorage.getItem("theme");
  //   if (saved === "dark") {
  //     setDark(true);
  //     document.documentElement.classList.add("dark");
  //   }
  // }, []);

  // useEffect(() => {
  //   document.documentElement.classList.toggle("dark", dark);
  //   localStorage.setItem("theme", dark ? "dark" : "light");
  // }, [dark]);

  const { pathname } = useLocation();
  const hideNavbar =
    (pathname.startsWith("/projects/") && pathname !== "/projects") ||
    pathname.startsWith("/view/") ||
    pathname.startsWith("/preview/");

  return (
    <>
      {/* <CyberThemeToggle /> */}
      {/* Holographic Theme Toggle */}
      {/* <div className="toggle-container fixed bottom-6 right-6 z-[9999]">
        <div className="toggle-wrap">
          <input
            className="toggle-input"
            id="holo-toggle"
            type="checkbox"
            checked={dark}
            onChange={() => setDark(!dark)}
          />
          <label className="toggle-track" htmlFor="holo-toggle">
            <div className="track-lines">
              <div className="track-line"></div>
            </div>

            <div className="toggle-thumb">
              <div className="thumb-core"></div>
              <div className="thumb-inner"></div>
              <div className="thumb-scan"></div>
              <div className="thumb-particles">
                <div className="thumb-particle"></div>
                <div className="thumb-particle"></div>
                <div className="thumb-particle"></div>
                <div className="thumb-particle"></div>
                <div className="thumb-particle"></div>
              </div>
            </div>

            <div className="toggle-data">
              <div className="data-text off">OFF</div>
              <div className="data-text on">ON</div>
              <div className="status-indicator off"></div>
              <div className="status-indicator on"></div>
            </div>

            <div className="energy-rings">
              <div className="energy-ring"></div>
              <div className="energy-ring"></div>
              <div className="energy-ring"></div>
            </div>

            <div className="interface-lines">
              <div className="interface-line"></div>
              <div className="interface-line"></div>
              <div className="interface-line"></div>
              <div className="interface-line"></div>
              <div className="interface-line"></div>
              <div className="interface-line"></div>
            </div>

            <div className="toggle-reflection"></div>
            <div className="holo-glow"></div>
          </label>
        </div>
      </div> */}
      <CyberCursorGlow />
      <div
        className="
          min-h-screen
          overflow-visible
          bg-[#F8FAFC] dark:bg-[#0B0F1A]
          text-[#0F172A] dark:text-slate-100
          transition-colors duration-300
        "
      >
        <Toaster />
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
          <Route path="/auth/:pathname" element={<AuthPage />} />
          <Route path="/account/settings" element={<Settings />} />
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
