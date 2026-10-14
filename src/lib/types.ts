export const LOCALES = ["ka", "en", "ru"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ka";

/** A piece of text in all three site languages. */
export type Loc = Record<Locale, string>;

export type Settings = {
  // not translated
  phone1: string;
  phone2: string;
  whatsapp: string;
  messenger: string;
  facebook: string;
  email: string;
  map_embed: string;
  hero_image: string;
  // translated
  address: Loc;
  working_hours: Loc;
  hero_title: Loc;
  hero_subtitle: Loc;
  about_short: Loc;
  about_body: Loc;
  footer_text: Loc;
};

export type Service = { id: string; icon: string; title: Loc; description: Loc };

export type PriceItem = { id: string; title: Loc; price: Loc; note: Loc };

/** kind: image = uploaded photo, video = uploaded video file, embed = YouTube/Facebook link */
export type MediaKind = "image" | "video" | "embed";

export type Media = { id: string; kind: MediaKind; url: string; title: Loc; category: Loc };

export type Project = {
  id: string;
  slug: string;
  date: string;
  cover: string;
  media: Media[];
  title: Loc;
  description: Loc;
  location: Loc;
  seo_title: Loc;
  seo_description: Loc;
};

export type Article = {
  id: string;
  slug: string;
  date: string;
  cover: string;
  title: Loc;
  excerpt: Loc;
  body: Loc;
  category: Loc;
  seo_title: Loc;
  seo_description: Loc;
};

export type PageSeo = { title: Loc; description: Loc };

export type PageKey =
  | "home"
  | "about"
  | "services"
  | "prices"
  | "projects"
  | "gallery"
  | "articles"
  | "contact";

export type Content = {
  settings: Settings;
  services: Service[];
  prices: PriceItem[];
  projects: Project[];
  gallery: Media[];
  articles: Article[];
  seo: Record<PageKey, PageSeo>;
};
