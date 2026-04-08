import { Link } from "react-router-dom";

const footerLinks = [
  { label: "소개", to: "/about" },
  { label: "개인정보처리방침", to: "/privacy" },
  { label: "이용약관", to: "/terms" },
  { label: "문의", to: "/contact" },
];

export default function Footer() {
  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        &copy; 2026 GameDrop. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        {footerLinks.map((link) => (
          <Link
            key={link.label}
            to={link.to}
            className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </footer>
  );
}
