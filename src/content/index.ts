/**
 * Every user-facing string on the site.
 *
 * Nothing here is invented. Facts come from the client dataset
 * (Assets/ihor_havryleiko_dataset.md). No client counts, testimonials,
 * ratings, timelines, kilograms, phone numbers or currency conversions
 * appear anywhere, because none exist in the dataset.
 *
 * Guarded by scripts/check-facts.mjs.
 */

export const site = {
  name: "Ігор Гаврилейко",
  romanised: "IGOR GAVRILEYKO",
  role: "Персональний тренер",
  city: "Львів",
  venue: "ФЦ «Пляж» (Аквапарк)",
  instagram: "https://www.instagram.com/gavel_man/",
  instagramHandle: "@gavel_man",
  telegram: "https://t.me/gavelman",
  telegramHandle: "@gavelman",
  year: 2026,
  title: "Ігор Гаврилейко — персональний тренер у Львові",
  ogImageAlt:
    "Ігор Гаврилейко, персональний тренер у Львові, у тренажерному залі фітнес-центру «Пляж»",
  description:
    "Персональні тренування у Львові та онлайн-супровід. Майстер спорту України з веслування на каное та Dragon Boat. 26 років у спорті, 16 — тренером. Перша консультація безкоштовна.",
} as const;

export const nav = {
  links: [
    { label: "Метод", href: "#method" },
    { label: "Результати", href: "#results" },
    { label: "Формати", href: "#formats" },
    { label: "Ціни", href: "#pricing" },
    { label: "Хто я", href: "#coach" },
  ],
  cta: { label: "Консультація", href: "#contact" },
} as const;

/* H1 wording is fixed by the client. The three-line break is a visual
   choice; the words are not. */
export const hero = {
  eyebrow: "Львів · Фітнес-центр «Пляж»",
  title: ["СИЛА", "ВИКОВАНА", "ВОДОЮ"],
  h2: "Персональний тренер у Львові — зал, вода, онлайн",
  lead: "Персональні тренування у Львові та онлайн. 26 років у спорті, 16 — тренером. Перша консультація безкоштовна.",
  ctaPrimary: { label: "Безкоштовна консультація", href: "#contact" },
  ctaSecondary: { label: "Як я працюю", href: "#method" },
} as const;

export const proof = {
  /* The section had no accessible name and «Європа / чемпіон» put a continent
     in a slot every sibling fills with a numeral. */
  title: "Ключові цифри",
  items: [
    { value: "26", label: "років у спорті" },
    { value: "16", label: "років тренерської діяльності" },
    { value: "2×", label: "майстер спорту України — каное та Dragonboat" },
    { value: "4", label: "титули: Україна, Європа, Євро-Азіатські ігри; призер ЧС" },
  ],
} as const;

export const fit = {
  eyebrow: "Коли система важливіша за мотивацію",
  h2: "Вам не потрібна ще одна програма з інтернету.",
  lead: "Потрібна та, що враховує вашу спину, ваш графік і вашу стартову точку.",
  items: [
    {
      n: "01",
      title: "Не знаю, з чого почати",
      body: "Замість універсального плану — заміри, цілі й обмеження, а вже потім навантаження.",
    },
    {
      n: "02",
      title: "Тренуюсь, але результат зупинився",
      body: "Найчастіше причина в техніці й прогресії, а не в кількості підходів. Це видно на заміри.",
    },
    {
      n: "03",
      title: "Боюся нашкодити собі",
      body: "Реабілітаційний тренінг, робота з поставою і контроль техніки на кожному занятті.",
    },
  ],
} as const;

/* The stroke cycle. The English names are set small in mono beside the
   Ukrainian: they are what make the metaphor legible as a real technical
   sequence rather than decoration, and they answer the objection that a
   metaphor obscures the factual method. */
export const method = {
  eyebrow: "Не на віру — на заміри",
  h2: "Чотири фази гребка. Одна логіка тренування.",
  lead: "Веслування — це чотири рухи, повторені тисячі разів у правильному порядку. Тренування працює так само.",
  phases: [
    {
      n: "01",
      ua: "Захват",
      en: "Catch",
      body: "Безкоштовна консультація, опорометричні дані, цілі й обмеження. Перш ніж щось піднімати — розуміємо, з чим працюємо.",
    },
    {
      n: "02",
      ua: "Проведення",
      en: "Drive",
      body: "Індивідуальна програма, контроль техніки, прогресія навантаження. Зал, вулиця або онлайн.",
    },
    {
      n: "03",
      ua: "Вихід",
      en: "Exit",
      body: "Відновлення: МФР, стретчинг, робота з поставою, міопресура. Сила без відновлення не тримається.",
    },
    {
      n: "04",
      ua: "Курс",
      en: "Recovery",
      body: "Регулярні заміри, коригування харчування, підтримка в месенджері 24/7. Курс тримаємо між гребками.",
    },
  ],
  close: "Вода не пробачає «на око». Зал теж — просто повільніше.",
} as const;

export const results = {
  eyebrow: "Справжні клієнти",
  h2: "Заміри, а не обіцянки",
  /* No lead. The slider animates on its own, so nothing needs explaining —
     an instruction line under a moving control just states the obvious. */
  labelBefore: "До",
  labelAfter: "Після",
  supportingH3: "Ще результати",
  disclaimer: "Результат індивідуальний. Фото публікуються за згодою клієнтів.",
} as const;

export const formats = {
  eyebrow: "Формати роботи",
  h2: "Формати тренувань у Львові та онлайн",
  rows: [
    {
      title: "Персональні тренування",
      where: "ФЦ «Пляж», Львів",
      body: "Індивідуальне заняття, контроль техніки, коригування на місці.",
    },
    {
      title: "Групові тренування",
      where: "Львів",
      body: "Мала група, спільна структура, персональна техніка.",
    },
    {
      title: "Онлайн-супровід",
      where: "Будь-де",
      body: "Програма, відеорозбір техніки, заміри й зв'язок у месенджері.",
    },
    {
      title: "Тренування з веслування",
      where: "Вода",
      body: "Техніка гребка від майстра спорту з каное та Dragon Boat (драгонбот).",
    },
  ],
  formatsLead: "Одна система. Різна відстань до тренера.",
  includedH3: "Що входить у співпрацю",
  included: [
    "Індивідуальна програма на базі опорометричних даних і цілей",
    "Контроль техніки виконання",
    "Коригування харчування",
    "Регулярні заміри прогресу",
    "Рекомендації",
    "Підтримка в месенджері 24/7",
  ],
} as const;

/* Prices carry an explicit currency field rather than a formatted string.
   That is what stops a later edit from silently "unifying" ₴ and $ — the
   dataset genuinely mixes them and no conversion may be invented. */
export const pricing = {
  eyebrow: "Ціни",
  h2: "Ціни на персональні тренування у Львові",
  lead: "Почати можна з розмови. Первинна консультація — безкоштовно. Далі — тільки якщо ми обидва бачимо, що це має сенс.",
  tiers: [
    {
      name: "Консультація",
      price: "0",
      currency: "₴",
      includes: "Цілі, стартова точка, план перших кроків",
      featured: false,
    },
    {
      name: "Разове тренування",
      price: "700",
      currency: "₴",
      intro: "Перше тренування — 400 ₴",
      includes: "Персональне заняття, контроль техніки, рекомендації",
      featured: false,
    },
    {
      name: "Місяць тренувань",
      price: "100",
      currency: "$",
      includes: "Програма на місяць, регулярні тренування, заміри",
      featured: false,
    },
    {
      name: "Тренування + харчування",
      price: "150",
      currency: "$",
      includes: "Усе з «Місяця» + коригування раціону",
      featured: false,
    },
    {
      name: "Максимальний",
      price: "200",
      currency: "$",
      includes: "+ підбір спортивного харчування + підтримка 24/7",
      featured: true,
    },
  ],
  note: "Місячні пакети — у доларах, разове заняття — у гривні. Актуальну суму підтверджуємо на консультації.",
} as const;

export const coach = {
  eyebrow: "Хто я",
  h2: "Знаю спорт як атлет. І як тренер.",
  paragraphs: [
    "Майстер спорту України з веслування на каное та на човнах Dragon Boat. Чемпіон України, чемпіон Європи, чемпіон Євро-Азіатських ігор, призер чемпіонату світу.",
    "Вища профільна освіта — Полтавський національний педагогічний університет імені В. Г. Короленка, факультет фізичного виховання.",
    "16 років я переношу те, що працює на воді, у зал: техніку, заміри й послідовність.",
  ],
} as const;

export const athlete = {
  eyebrow: "Вода",
  /* The headline is a two-part composition: the promise, then the line about
     the canoe that used to sit in the body copy. Client wording, verbatim. */
  h2: "Вода вчить працювати в команді",
  h2Sub:
    "Каное не пробачає зайвого руху. Кожен гребок або веде човен, або витрачає силу.",
  offerLead: "В нашій команді ти також отримаєш:",
  offers: [
    {
      n: "01",
      title: "Dragon Boat та активний відпочинок",
      body: "Групові тренування з веслування в компанії однодумців: спорт, природа, нові знайомства, спілкування й теплі зустрічі після тренувань.",
    },
    {
      n: "02",
      title: "Індивідуальні тренування просто неба",
      body: "Персональні заняття на свіжому повітрі з програмою під вашу форму, цілі та рівень підготовки.",
    },
    {
      n: "03",
      title: "Спортивне харчування та підтримка організму",
      body: "Допоможу розібратися зі спортивним харчуванням, БАДами та питаннями фармакологічної підтримки.",
    },
  ],
} as const;

/* «Майстер спорту України». Never «міжнародного класу» — a previous
   prototype fabricated that upgrade. The build fails on it. */
export const credentials = {
  eyebrow: "Кваліфікація",
  h2: "Кваліфікація: підтверджено, не заявлено",
  groups: [
    {
      title: "Звання",
      items: [
        "Майстер спорту України з веслування на каное",
        "Майстер спорту України з веслування на човнах Dragon Boat",
      ],
    },
    {
      title: "Досягнення",
      items: [
        "Чемпіон України",
        "Чемпіон Європи",
        "Чемпіон Євро-Азіатських ігор",
        "Призер Чемпіонату світу",
      ],
    },
    {
      title: "Освіта",
      items: [
        "Полтавський національний педагогічний університет імені В. Г. Короленка — факультет фізичного виховання",
      ],
    },
    {
      title: "Курси та семінари",
      items: [
        "Персональний тренер тренажерного залу (модулі 1–3)",
        "Дієтологія у фітнесі",
        "Реабілітаційний тренінг: фізична активність при міжхребцевих грижах",
        "Міофасціальне розслаблення (МФР)",
        "Функціональний тренінг TRX / COREVIPER",
        "Перша домедична допомога",
        "Масаж: теоретико-практичний курс",
      ],
    },
  ],
} as const;

export const faq = {
  eyebrow: "Питання",
  h2: "Що зазвичай питають перед стартом.",
  note: "Не працюю з людьми, яким медично протипоказані навантаження в тренажерному залі.",
  items: [
    {
      q: "Я ніколи не тренувався. Це проблема?",
      a: "Ні. Початківці — окрема категорія роботи. Перше заняття завжди починається з техніки й невеликої ваги, а не з максимумів.",
    },
    {
      q: "Скільки разів на тиждень треба ходити?",
      a: "Залежить від цілі, графіка й відновлення. Це визначаємо на безкоштовній консультації, а не за шаблоном.",
    },
    {
      q: "У мене проблеми зі спиною. Ви берете таких?",
      a: "Беру, якщо навантаження в тренажерному залі не медично протипоказані. Працюю з реабілітаційним тренінгом і поставою. Якщо лікар заборонив зал — це не до мене.",
    },
    {
      q: "Онлайн справді працює?",
      a: "Працює, коли є дисципліна й зворотний зв'язок: програма, відеорозбір техніки, заміри та щоденний контакт у месенджері.",
    },
    {
      q: "Що входить у «підтримку 24/7»?",
      a: "Зв'язок у месенджері: питання щодо техніки, харчування й самопочуття. Це супровід, а не цілодобовий дзвінок.",
    },
    {
      q: "Чи потрібне спортивне харчування?",
      a: "Не обов'язково. Якщо воно доречне для вашої цілі — підбираємо окремо. Це не умова співпраці.",
    },
  ],
} as const;

/* No phone or email exists in the dataset and none was invented.
   Instagram is the real channel and the form says so. */
/* Site credit. Real handles, linking to the real chats. */
export const credit = {
  label: "Розробка сайту",
  name: "Сергій Бурмич",
  links: [
    { network: "telegram", handle: "@Bsv_22", href: "https://t.me/Bsv_22" },
    { network: "instagram", handle: "@serhiy_lucky", href: "https://www.instagram.com/serhiy_lucky/" },
  ],
} as const;

export const contact = {
  eyebrow: "Почати",
  h2: "Розкажіть, що хочете змінити.",
  lead: "Напишіть у Telegram або Instagram — відповім особисто. Перша консультація безкоштовна і ні до чого не зобов'язує.",
  ctaTelegram: { label: "Написати в Telegram", href: site.telegram },
  ctaInstagram: { label: "Написати в Instagram", href: site.instagram },
  formTitle: "Або підготуйте повідомлення",
  formHint:
    "Заповніть три поля — текст скопіюється, і вам залишиться вставити його в чат.",
  fields: [
    { name: "name", label: "Ім'я", type: "text" },
    { name: "goal", label: "Ваша ціль", type: "textarea" },
    { name: "contact", label: "Зручний спосіб зв'язку", type: "text" },
  ],
  submitTelegram: "Скопіювати й відкрити Telegram",
  submitInstagram: "Скопіювати й відкрити Instagram",
  copied: "Повідомлення скопійовано — вставте його в чат.",
  copyFailed: "Не вдалося скопіювати. Скопіюйте текст вручну:",
} as const;
