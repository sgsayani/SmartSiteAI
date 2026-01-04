const Footer = () => {
  return (
    <footer
      className="
        mt-24 py-6 text-center text-sm
        border-t
        border-[#E2E8F0] dark:border-white/10
        text-[#64748B] dark:text-slate-400
        bg-transparent
      "
    >
      <p>
        © 2026{" "}
        <span className="font-medium text-[#0F172A] dark:text-slate-200">
          SmartSite AI
        </span>
        . All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
