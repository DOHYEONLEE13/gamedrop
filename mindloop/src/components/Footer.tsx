import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  const footerLinks = [
    { label: t("footer.about"), to: "/about" },
    { label: t("footer.guide"), to: "/guide" },
    { label: t("footer.contentPolicy"), to: "/content-policy" },
    { label: t("footer.privacy"), to: "/privacy" },
    { label: t("footer.terms"), to: "/terms" },
    { label: t("footer.contact"), to: "/contact" },
  ];

  return (
    <footer className="py-12 px-8 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4">
      <p className="text-muted-foreground text-sm">
        {t("footer.copyright")}
      </p>
      <div className="flex items-center gap-6">
        {footerLinks.map((link) => (
          <Link
            key={link.to}
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
