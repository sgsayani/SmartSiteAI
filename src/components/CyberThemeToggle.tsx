// import { useEffect, useState } from "react";

// const CyberThemeToggle = () => {
//   const [mode, setMode] = useState<"soft" | "hardcore">("soft");

//   useEffect(() => {
//     const saved = localStorage.getItem("cyber-theme") as
//       | "soft"
//       | "hardcore"
//       | null;

//     if (saved) {
//       setMode(saved);
//       document.body.classList.toggle("theme-hardcore", saved === "hardcore");
//     }
//   }, []);

//   const toggleTheme = () => {
//     const next = mode === "soft" ? "hardcore" : "soft";
//     setMode(next);
//     localStorage.setItem("cyber-theme", next);
//     document.body.classList.toggle("theme-hardcore", next === "hardcore");
//   };

//   return (
//     <div className="cyber-toggle">
//       <button onClick={toggleTheme}>
//         {mode === "soft" ? "Soft Sci-Fi" : "Hardcore Cyber"}
//       </button>
//     </div>
//   );
// };

// export default CyberThemeToggle;
