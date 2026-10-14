import { DEFAULT_LOCALE, LOCALES, type Loc, type Locale } from "@/lib/types";

export { DEFAULT_LOCALE, LOCALES };
export type { Loc, Locale };

export const isLocale = (v: string): v is Locale => (LOCALES as readonly string[]).includes(v);

export const LOCALE_NAMES: Record<Locale, string> = {
  ka: "ქართული",
  en: "English",
  ru: "Русский",
};

export const LOCALE_SHORT: Record<Locale, string> = { ka: "KA", en: "EN", ru: "RU" };

/** Read one language out of a translated field, falling back to Georgian. */
export function tx(v: Loc | string | undefined, l: Locale): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  return v[l] || v[DEFAULT_LOCALE] || v.en || v.ru || "";
}

export const emptyLoc = (): Loc => ({ ka: "", en: "", ru: "" });

/** Interface text. Content text lives in data/content.json and is edited in the admin. */
export const UI = {
  nav: {
    home: { ka: "მთავარი", en: "Home", ru: "Главная" },
    about: { ka: "ჩვენ შესახებ", en: "About us", ru: "О нас" },
    services: { ka: "სერვისები", en: "Services", ru: "Услуги" },
    prices: { ka: "ფასები", en: "Prices", ru: "Цены" },
    projects: { ka: "პროექტები", en: "Projects", ru: "Проекты" },
    gallery: { ka: "გალერეა", en: "Gallery", ru: "Галерея" },
    articles: { ka: "სტატიები", en: "Articles", ru: "Статьи" },
    contact: { ka: "კონტაქტი", en: "Contact", ru: "Контакты" },
    more: { ka: "სხვა", en: "More", ru: "Ещё" },
  },
  cta: {
    contactUs: { ka: "დაგვიკავშირდით", en: "Contact us", ru: "Свяжитесь с нами" },
    ourProjects: { ka: "ჩვენი პროექტები", en: "Our projects", ru: "Наши проекты" },
    moreAbout: { ka: "მეტი ჩვენ შესახებ", en: "More about us", ru: "Подробнее о нас" },
    allServices: { ka: "ყველა სერვისი", en: "All services", ru: "Все услуги" },
    allProjects: { ka: "ყველა პროექტი", en: "All projects", ru: "Все проекты" },
    otherProjects: { ka: "სხვა პროექტები", en: "Other projects", ru: "Другие проекты" },
    allArticles: { ka: "ყველა სტატია", en: "All articles", ru: "Все статьи" },
    priceCheck: { ka: "ფასის დაზუსტება", en: "Ask for a quote", ru: "Уточнить цену" },
    similarProject: {
      ka: "მსგავსი პროექტი გჭირდებათ?",
      en: "Need a similar project?",
      ru: "Нужен похожий проект?",
    },
  },
  home: {
    aboutKicker: { ka: "ჩვენ შესახებ", en: "About us", ru: "О нас" },
    aboutTitle: {
      ka: "გეოდეზია, რომელსაც ენდობიან",
      en: "Surveying you can rely on",
      ru: "Геодезия, которой доверяют",
    },
    servicesKicker: { ka: "სერვისები", en: "Services", ru: "Услуги" },
    servicesTitle: { ka: "რას ვაკეთებთ", en: "What we do", ru: "Чем мы занимаемся" },
    servicesText: {
      ka: "სრული გეოდეზიური მომსახურება, გაზომვიდან მზა დოკუმენტაციამდე.",
      en: "Full surveying service, from field measurements to finished documents.",
      ru: "Полный комплекс геодезических работ, от замеров до готовых документов.",
    },
    projectsKicker: { ka: "პროექტები", en: "Projects", ru: "Проекты" },
    projectsTitle: {
      ka: "ბოლო შესრულებული სამუშაოები",
      en: "Recently completed work",
      ru: "Недавно выполненные работы",
    },
    articlesKicker: { ka: "სტატიები", en: "Articles", ru: "Статьи" },
    articlesTitle: { ka: "სასარგებლო ინფორმაცია", en: "Useful information", ru: "Полезная информация" },
    ctaTitle: {
      ka: "გჭირდებათ ტოპოგრაფიული გეგმა?",
      en: "Need a topographic plan?",
      ru: "Нужен топографический план?",
    },
    ctaText: {
      ka: "დაგვირეკეთ ან მოგვწერეთ. უფასოდ გავაანალიზებთ თქვენს ამოცანას და გეტყვით ზუსტ ფასსა და ვადას.",
      en: "Call or message us. We will review your task free of charge and give you an exact price and timeline.",
      ru: "Позвоните или напишите. Мы бесплатно оценим задачу и назовём точную цену и сроки.",
    },
  },
  services: {
    notFound: {
      ka: "ვერ იპოვეთ საჭირო სერვისი? დაგვირეკეთ, ვიმუშავებთ არასტანდარტულ ამოცანებზეც.",
      en: "Cannot find the service you need? Call us, we also take on non-standard tasks.",
      ru: "Не нашли нужную услугу? Позвоните нам, мы беремся и за нестандартные задачи.",
    },
  },
  prices: {
    service: { ka: "სერვისი", en: "Service", ru: "Услуга" },
    price: { ka: "ფასი", en: "Price", ru: "Цена" },
    note: { ka: "შენიშვნა", en: "Note", ru: "Примечание" },
    noticeLabel: { ka: "ყურადღება:", en: "Please note:", ru: "Обратите внимание:" },
    notice: {
      ka: "მითითებული ფასები საორიენტაციოა. საბოლოო ფასი დამოკიდებულია პროექტის მოცულობაზე, ობიექტის მდებარეობაზე, რელიეფსა და შესრულების ვადაზე. ზუსტი ფასის გასაგებად დაგვიკავშირდით, კონსულტაცია უფასოა.",
      en: "The prices shown are indicative. The final price depends on the size of the project, the location of the site, the terrain and the deadline. Contact us for an exact quote, the consultation is free.",
      ru: "Указанные цены ориентировочные. Итоговая цена зависит от объёма проекта, расположения объекта, рельефа и сроков. Свяжитесь с нами для точного расчёта, консультация бесплатная.",
    },
  },
  project: {
    location: { ka: "მდებარეობა", en: "Location", ru: "Расположение" },
    date: { ka: "შესრულების თარიღი", en: "Completed", ru: "Дата выполнения" },
    media: { ka: "ფოტო და ვიდეო", en: "Photos and video", ru: "Фото и видео" },
    backToList: { ka: "ყველა პროექტი", en: "All projects", ru: "Все проекты" },
    empty: {
      ka: "პროექტები ჯერ არ არის დამატებული.",
      en: "No projects have been added yet.",
      ru: "Проекты пока не добавлены.",
    },
  },
  article: {
    backToList: { ka: "ყველა სტატია", en: "All articles", ru: "Все статьи" },
    questionsTitle: { ka: "კითხვები დაგრჩათ?", en: "Still have questions?", ru: "Остались вопросы?" },
    questionsText: {
      ka: "დაგვიკავშირდით, უფასოდ გაგიწევთ კონსულტაციას თქვენს კონკრეტულ შემთხვევაზე.",
      en: "Get in touch, we will advise you on your specific case free of charge.",
      ru: "Свяжитесь с нами, мы бесплатно проконсультируем по вашему случаю.",
    },
    empty: {
      ka: "სტატიები ჯერ არ არის დამატებული.",
      en: "No articles have been added yet.",
      ru: "Статьи пока не добавлены.",
    },
  },
  gallery: {
    all: { ka: "ყველა", en: "All", ru: "Все" },
    empty: { ka: "ჯერ არაფერია დამატებული.", en: "Nothing here yet.", ru: "Пока ничего нет." },
    open: { ka: "მედიის გახსნა", en: "Open media", ru: "Открыть медиа" },
    close: { ka: "დახურვა", en: "Close", ru: "Закрыть" },
    prev: { ka: "წინა", en: "Previous", ru: "Назад" },
    next: { ka: "შემდეგი", en: "Next", ru: "Вперёд" },
    openExternal: {
      ka: "ვიდეოს გახსნა ახალ ფანჯარაში",
      en: "Open the video in a new window",
      ru: "Открыть видео в новом окне",
    },
  },
  contact: {
    phone: { ka: "ტელეფონი", en: "Phone", ru: "Телефон" },
    email: { ka: "ელ. ფოსტა", en: "Email", ru: "Эл. почта" },
    address: { ka: "მისამართი", en: "Address", ru: "Адрес" },
    hours: { ka: "სამუშაო საათები", en: "Working hours", ru: "Часы работы" },
    map: { ka: "რუკა", en: "Map", ru: "Карта" },
  },
  footer: {
    menu: { ka: "მენიუ", en: "Menu", ru: "Меню" },
    contact: { ka: "კონტაქტი", en: "Contact", ru: "Контакты" },
    social: { ka: "სოციალური ქსელები", en: "Social", ru: "Соцсети" },
    rights: { ka: "ყველა უფლება დაცულია", en: "All rights reserved", ru: "Все права защищены" },
    admin: { ka: "ადმინისტრირება", en: "Admin", ru: "Администрирование" },
  },
  aria: {
    home: { ka: "მთავარი გვერდი", en: "Home page", ru: "Главная страница" },
    logo: { ka: "კომპანიის ლოგო", en: "Company logo", ru: "Логотип компании" },
    menu: { ka: "მენიუ", en: "Menu", ru: "Меню" },
    facebook: { ka: "ჩვენი Facebook გვერდი", en: "Our Facebook page", ru: "Наша страница в Facebook" },
    call: { ka: "დაგვირეკეთ", en: "Call us", ru: "Позвоните нам" },
    whatsapp: { ka: "მოგვწერეთ WhatsApp-ით", en: "Message us on WhatsApp", ru: "Напишите нам в WhatsApp" },
    messenger: { ka: "მოგვწერეთ Messenger-ით", en: "Message us on Messenger", ru: "Напишите нам в Messenger" },
    language: { ka: "ენის არჩევა", en: "Choose language", ru: "Выбор языка" },
  },
} satisfies Record<string, unknown>;

/** `t(UI.nav.home, locale)` */
export const t = tx;
