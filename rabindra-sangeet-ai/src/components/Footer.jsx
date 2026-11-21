import { Music2, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">

        <div className="footer-brand">
          <Music2 size={22} />

          <div>
            <strong>Rabindra Sangeet AI</strong>
            <p>
              Exploring the musical heritage of Bengal
              through artificial intelligence.
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Rabindra Sangeet AI.
            Academic project.
          </span>

          <span>
            Made with <Heart size={13} /> for Bengali music.
          </span>
        </div>

      </div>
    </footer>
  );
}