const Footer = () => {
  return (
    <footer className="cyber-footer">
      <div className="cyber-footer-inner">
        
        {/* LEFT */}
        <div className="cyber-footer-left">
          <p>
            © 2026 <span>SmartSite AI</span>. All rights reserved.
          </p>
          <p className="made-by">Made by <span>Sayani Ghatak</span></p>
        </div>

        {/* RIGHT */}
        <ul className="cyber-socials">
          
          {/* LinkedIn */}
          <li>
            <a href="www.linkedin.com/in/sayani-ghatak" target="_blank" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24">
                <path d="M4.98 3.5C4.98 4.88 3.9 6 2.5 6S0 4.88 0 3.5 1.1 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4v15h-4v-15zM8.5 8.5h3.8v2h.1c.53-.95 1.84-1.95 3.78-1.95 4.04 0 4.79 2.66 4.79 6.12v8.83h-4v-7.83c0-1.87-.04-4.28-2.61-4.28-2.62 0-3.02 2.04-3.02 4.14v7.97h-4v-15z"/>
              </svg>
            </a>
          </li>

          {/* GitHub */}
          <li>
            <a href="https://github.com/sgsayani" target="_blank" aria-label="GitHub">
              <svg viewBox="0 0 24 24">
                <path d="M12 .5C5.73.5.5 5.74.5 12.03c0 5.1 3.29 9.43 7.86 10.96.57.1.78-.25.78-.55v-2.1c-3.2.7-3.88-1.38-3.88-1.38-.53-1.34-1.3-1.7-1.3-1.7-1.07-.73.08-.72.08-.72 1.18.08 1.8 1.22 1.8 1.22 1.05 1.8 2.75 1.28 3.42.98.1-.76.4-1.28.73-1.57-2.55-.3-5.23-1.28-5.23-5.7 0-1.26.45-2.3 1.2-3.1-.12-.3-.52-1.52.12-3.18 0 0 .98-.3 3.2 1.18.93-.26 1.92-.4 2.9-.4.99 0 1.98.14 2.9.4 2.22-1.48 3.2-1.18 3.2-1.18.64 1.66.24 2.88.12 3.18.75.8 1.2 1.84 1.2 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.15v3.18c0 .3.2.66.8.55 4.56-1.53 7.85-5.86 7.85-10.96C23.5 5.74 18.27.5 12 .5z"/>
              </svg>
            </a>
          </li>

          {/* Instagram */}
          <li>
            <a href="https://www.instagram.com/its_sayani28?igsh=MXA2YXZ3cWppeGt6Yw==" target="_blank" aria-label="Instagram">
              <svg viewBox="0 0 24 24">
                <path d="M7 2C4.2 2 2 4.2 2 7v10c0 2.8 2.2 5 5 5h10c2.8 0 5-2.2 5-5V7c0-2.8-2.2-5-5-5H7zm10 2c1.7 0 3 1.3 3 3v10c0 1.7-1.3 3-3 3H7c-1.7 0-3-1.3-3-3V7c0-1.7 1.3-3 3-3h10zm-5 3.5A4.5 4.5 0 1 0 12 17a4.5 4.5 0 0 0 0-9zm0 2A2.5 2.5 0 1 1 12 14a2.5 2.5 0 0 1 0-5zm4.75-.9a1.05 1.05 0 1 0 0-2.1 1.05 1.05 0 0 0 0 2.1z"/>
              </svg>
            </a>
          </li>

          {/* Discord */}
          <li>
            <a href="https://discord.com" target="_blank" aria-label="Discord">
              <svg viewBox="0 0 24 24">
                <path d="M20 4.5A19.6 19.6 0 0 0 15.3 3a13.8 13.8 0 0 0-.7 1.5 18.2 18.2 0 0 0-5.2 0A13.8 13.8 0 0 0 8.7 3 19.6 19.6 0 0 0 4 4.5C1.2 8.6.5 12.6.8 16.6a19.9 19.9 0 0 0 6 3.1c.5-.7.9-1.5 1.3-2.3a12.8 12.8 0 0 1-2-.9c.2-.2.4-.4.6-.6a14.6 14.6 0 0 0 10.6 0c.2.2.4.4.6.6a12.8 12.8 0 0 1-2 .9c.4.8.8 1.6 1.3 2.3a19.9 19.9 0 0 0 6-3.1c.4-4-.3-8-3.2-12.1z"/>
              </svg>
            </a>
          </li>

        </ul>
      </div>
    </footer>
  );
};

export default Footer;
