
import {
  Music2,
  Menu,
  X,
  ArrowUpRight
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

const links = [
  { name: "Home", href: "/#home", type: "section" },
  { name: "Classify Lyrics", href: "/classify", type: "page" },
  { name: "Explore Parjaay", href: "/#explore", type: "section" },
  { name: "Model Insights", href: "/#insights", type: "section" },
  { name: "About", href: "/#about", type: "section" }
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="nav-inner container">

        <Link
          className="brand"
          to="/"
          onClick={closeMenu}
        >
          <span className="brand-icon">
            <Music2 size={22} />
          </span>

          <span className="brand-text">
            <strong>Rabindra Sangeet</strong>
            <small>AI PARJAAY CLASSIFICATION</small>
          </span>
        </Link>

        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          {links.map((link) => (
            link.type === "page" ? (
              <Link
                key={link.name}
                to={link.href}
                onClick={closeMenu}
              >
                {link.name}
              </Link>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={closeMenu}
              >
                {link.name}
              </a>
            )
          ))}
        </nav>

        <Link
          className="nav-cta"
          to="/classify"
          onClick={closeMenu}
        >
          Try AI <ArrowUpRight size={16} />
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

      </div>
    </header>
  );
}
