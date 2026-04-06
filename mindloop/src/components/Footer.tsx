export default function Footer() {
  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        &copy; 2026 PLAYWAVE. All rights reserved.
      </p>
      <div className="flex items-center gap-6">
        {["개인정보처리방침", "이용약관", "문의"].map((link) => (
          <a
            key={link}
            href="#"
            className="text-muted-foreground text-sm hover:text-foreground transition-colors duration-200"
          >
            {link}
          </a>
        ))}
      </div>
    </footer>
  );
}
