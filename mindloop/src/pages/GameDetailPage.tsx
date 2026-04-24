import { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useGameBySlug, useGames } from "@/hooks/useGames";
import { useAuthContext } from "@/contexts/AuthContext";
import { useGameInteractions } from "@/hooks/useGameInteractions";
import { useToast } from "@/components/Toast";
import SEO from "@/components/SEO";
import AuthModal from "@/components/AuthModal";

const BASE_URL = "https://gamedrop.win";

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { game, loading, notFound } = useGameBySlug(slug);
  const { games: allGames } = useGames();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const { liked, saved, toggleLike, toggleSave, incrementViews, recordPlay } =
    useGameInteractions(game?.id ?? null);
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loadingHtml, setLoadingHtml] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const viewCounted = useRef(false);

  // Load HTML content
  useEffect(() => {
    if (!game?.html_url) {
      setHtmlContent(null);
      return;
    }
    setLoadingHtml(true);
    fetch(game.html_url)
      .then((res) => res.text())
      .then((html) => setHtmlContent(html))
      .catch(() => setHtmlContent(null))
      .finally(() => setLoadingHtml(false));
  }, [game?.html_url]);

  // Increment views + record play on mount (per-slug, not per-render)
  useEffect(() => {
    if (!game || viewCounted.current) return;
    viewCounted.current = true;
    incrementViews();
    recordPlay();
    return () => {
      viewCounted.current = false;
    };
  }, [game, incrementViews, recordPlay]);

  const handleLike = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const success = await toggleLike();
    if (success) {
      toast(liked ? t("gamePlay.unlike") : t("gamePlay.like"), liked ? "info" : "success");
    }
  };

  const handleSave = async () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const success = await toggleSave();
    if (success) {
      toast(saved ? t("gamePlay.unsave") : t("gamePlay.saveForLater"), saved ? "info" : "success");
    }
  };

  const handleShare = async () => {
    const url = `${BASE_URL}/games/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: game?.title ?? "GameDrop", url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast(t("common.urlCopied"), "success");
    } catch {
      toast(t("common.copyFailed"), "error");
    }
  };

  // Not found state — send signal for crawlers
  if (!loading && notFound) {
    return (
      <>
        <SEO
          title={t("gameDetail.notFound")}
          description={t("gameDetail.notFoundDesc")}
          path={`/games/${slug ?? ""}`}
          noindex
        />
        <div className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-24">
          <h1 className="text-3xl font-bold mb-3">{t("gameDetail.notFound")}</h1>
          <p className="text-muted-foreground mb-8 text-center">{t("gameDetail.notFoundDesc")}</p>
          <button
            onClick={() => navigate("/games")}
            className="px-6 py-3 rounded-full bg-foreground text-background font-medium hover:opacity-90 transition-opacity"
          >
            {t("gameDetail.browse")}
          </button>
        </div>
      </>
    );
  }

  // Loading state
  if (loading || !game) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 pb-24">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-muted-foreground/30 border-t-foreground rounded-full"
        />
      </div>
    );
  }

  // Dynamic SEO: title, description, og:image, canonical
  const categoryLabel = t(`category.${game.category}`, { defaultValue: game.category });
  const seoTitle = `${game.title} - ${categoryLabel}`;
  const seoDesc =
    game.description ||
    t("seo.defaultDesc", {
      defaultValue: `Play ${game.title} free online at GameDrop.`,
    });
  const ogImage = game.thumbnail_url || `${BASE_URL}/og-image.png`;
  const canonicalPath = `/games/${game.slug}`;
  const canonicalUrl = `${BASE_URL}${canonicalPath}`;

  // JSON-LD: VideoGame schema
  const videoGameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    description: seoDesc,
    url: canonicalUrl,
    image: ogImage,
    genre: categoryLabel,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    inLanguage: "ko",
    playMode: game.type === "shortform" ? "SinglePlayer" : "SinglePlayer",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    aggregateRating:
      game.views > 10
        ? {
            "@type": "AggregateRating",
            ratingValue: "4.5",
            ratingCount: Math.max(game.likes, 1),
            bestRating: "5",
          }
        : undefined,
    datePublished: game.created_at,
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Games", item: `${BASE_URL}/games` },
      { "@type": "ListItem", position: 3, name: game.title, item: canonicalUrl },
    ],
  };

  return (
    <>
      <SEO
        title={seoTitle}
        description={seoDesc}
        path={canonicalPath}
        image={ogImage}
        type="article"
      />
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(videoGameSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <div className="min-h-screen pt-20 pb-24 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <span>/</span>
            <Link to="/games" className="hover:text-foreground transition-colors">Games</Link>
            <span>/</span>
            <span className="text-foreground truncate max-w-[200px]">{game.title}</span>
          </nav>

          {/* Title + meta */}
          <header className="mb-6">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{game.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-secondary text-foreground">
                {categoryLabel}
              </span>
              <span className="px-3 py-1 rounded-full border border-border/40">
                {game.type === "shortform" ? t("gameType.short") : t("gameType.long")}
              </span>
              {game.playtime && <span>⏱ {game.playtime}</span>}
              <span>{t("gameDetail.views", { count: game.views })}</span>
              <span>{t("gameDetail.likes", { count: game.likes })}</span>
            </div>
          </header>

          {/* Game iframe */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border/30 bg-card mb-6">
            {loadingHtml ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 border-2 border-muted-foreground/30 border-t-foreground rounded-full"
                />
              </div>
            ) : htmlContent ? (
              <iframe
                srcDoc={htmlContent}
                sandbox="allow-scripts"
                title={game.title}
                className="w-full h-full border-none"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                {game.thumbnail_url && (
                  <img
                    src={game.thumbnail_url}
                    alt={game.title}
                    width={192}
                    height={192}
                    className="w-48 h-48 rounded-2xl object-cover mb-4 opacity-60"
                  />
                )}
                <p className="text-muted-foreground">
                  {game.html_url ? t("gamePlay.loadFailed") : t("gamePlay.noFile")}
                </p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                liked ? "bg-red-400/10 text-red-400" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
              aria-label={liked ? t("gamePlay.unlike") : t("gamePlay.like")}
            >
              <HeartIcon filled={liked} />
              <span className="text-sm">{game.likes}</span>
            </button>
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                saved ? "bg-blue-400/10 text-blue-400" : "bg-secondary text-foreground hover:bg-secondary/80"
              }`}
              aria-label={saved ? t("gamePlay.unsave") : t("gamePlay.saveForLater")}
            >
              <BookmarkIcon filled={saved} />
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-foreground hover:bg-secondary/80 transition-colors"
              aria-label={t("gameDetail.share")}
            >
              <ShareIcon />
              <span className="text-sm">{t("gameDetail.share")}</span>
            </button>
          </div>

          {/* Description */}
          {game.description && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-3">{t("gameDetail.description")}</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {game.description}
              </p>
            </section>
          )}

          {/* Tags */}
          {game.tags && game.tags.length > 0 && (
            <section className="mb-8">
              <div className="flex flex-wrap gap-2">
                {game.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs bg-secondary text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Game info card */}
          <section className="mb-8 rounded-2xl border border-border/40 bg-card/40 p-5 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold mb-4">
              {t("gameDetail.infoTitle")}
            </h2>
            <dl className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <dt className="text-muted-foreground text-xs mb-1">
                  {t("gameDetail.category")}
                </dt>
                <dd className="font-medium">{categoryLabel}</dd>
              </div>
              {game.playtime && (
                <div>
                  <dt className="text-muted-foreground text-xs mb-1">
                    {t("gameDetail.playtime")}
                  </dt>
                  <dd className="font-medium">{game.playtime}</dd>
                </div>
              )}
              <div>
                <dt className="text-muted-foreground text-xs mb-1">
                  {t("gameDetail.uploadedOn")}
                </dt>
                <dd className="font-medium">
                  {new Date(game.created_at).toLocaleDateString()}
                </dd>
              </div>
              {game.tags && game.tags.length > 0 && (
                <div className="col-span-2 md:col-span-1">
                  <dt className="text-muted-foreground text-xs mb-1">
                    {t("gameDetail.tags")}
                  </dt>
                  <dd className="font-medium truncate">{game.tags.join(", ")}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* How to play — category-based fallback when description has no controls info */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3">
              {t("gameDetail.howToPlayTitle")}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t(`gameDetail.howToPlay${game.category.charAt(0).toUpperCase() + game.category.slice(1)}`, {
                defaultValue: t("gameDetail.howToPlayCasual"),
              })}
            </p>
          </section>

          {/* Similar games — same category, exclude self, top 6 */}
          {(() => {
            const similar = allGames
              .filter((g) => g.category === game.category && g.id !== game.id)
              .slice(0, 6);
            return (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">
                  {t("gameDetail.similarTitle")}
                </h2>
                {similar.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    {similar.map((g) => (
                      <Link
                        key={g.id}
                        to={`/games/${g.slug}`}
                        className="group block rounded-xl overflow-hidden border border-border/30 hover:border-border transition-colors"
                      >
                        <div className="aspect-[4/3] bg-card overflow-hidden">
                          {g.thumbnail_url ? (
                            <img
                              src={g.thumbnail_url}
                              alt={g.title}
                              loading="lazy"
                              decoding="async"
                              width="400"
                              height="300"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                              {g.title}
                            </div>
                          )}
                        </div>
                        <div className="p-2">
                          <p className="text-sm font-medium truncate">{g.title}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    {t("gameDetail.similarEmpty")}
                  </p>
                )}
              </section>
            );
          })()}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
