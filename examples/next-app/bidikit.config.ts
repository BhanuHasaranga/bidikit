import type { BidiConfig } from "@bidikit/core";

const bidiConfig: BidiConfig = {
  defaultLanguage: "en",
  fallbackLanguage: "en",
  supportedLanguages: ["en", "ar", "fr"],
  rtlLanguages: ["ar", "he", "fa", "ur"],
  storage: "cookie",
  autoDetect: true,
  autoDirection: true,
  mirrorIcons: true,
  mirrorImages: false,
  animations: true,
  translations: {
    en: {
      common: {
        welcome: "Welcome to BidiKit",
        tagline: "The missing layer for RTL & LTR web applications",
        switchLanguage: "Switch Language",
        currentLanguage: "Current language: {{lang}}",
        currentDirection: "Direction: {{dir}}",
        nav: {
          home: "Home",
          about: "About",
          docs: "Documentation",
        },
        hero: {
          title: "Build for the Global Web",
          subtitle:
            "BidiKit makes any React or Next.js application automatically adapt between LTR and RTL layouts with zero configuration.",
          cta: "Get Started",
          docs: "View Docs",
        },
        features: {
          title: "Everything you need for bidirectional UI",
          direction: {
            title: "Auto Direction",
            desc: "Automatically updates document.dir, lang, and CSS variables when language changes.",
          },
          translation: {
            title: "Translation Engine",
            desc: "Nested keys, pluralization, interpolation, fallback, and lazy loading out of the box.",
          },
          tailwind: {
            title: "Tailwind Plugin",
            desc: "Logical property utilities and rtl:/ltr: variants for Tailwind CSS.",
          },
          components: {
            title: "Direction-aware Components",
            desc: "Row, Column, Navbar, Sidebar, Button, Icon and more - all RTL-aware.",
          },
        },
      },
    },
    ar: {
      common: {
        welcome: "مرحباً بك في BidiKit",
        tagline: "الطبقة المفقودة لتطبيقات الويب RTL و LTR",
        switchLanguage: "تغيير اللغة",
        currentLanguage: "اللغة الحالية: {{lang}}",
        currentDirection: "الاتجاه: {{dir}}",
        nav: {
          home: "الرئيسية",
          about: "حول",
          docs: "التوثيق",
        },
        hero: {
          title: "ابنِ للويب العالمي",
          subtitle:
            "يجعل BidiKit أي تطبيق React أو Next.js يتكيف تلقائياً بين تخطيطات LTR و RTL بدون أي إعداد.",
          cta: "ابدأ الآن",
          docs: "عرض الوثائق",
        },
        features: {
          title: "كل ما تحتاجه لواجهة مستخدم ثنائية الاتجاه",
          direction: {
            title: "الاتجاه التلقائي",
            desc: "يحدث document.dir و lang ومتغيرات CSS تلقائياً عند تغيير اللغة.",
          },
          translation: {
            title: "محرك الترجمة",
            desc: "مفاتيح متداخلة، جمع، استيفاء، احتياطي، وتحميل كسول خارج الصندوق.",
          },
          tailwind: {
            title: "مكوّن Tailwind",
            desc: "أدوات الخصائص المنطقية ومتغيرات rtl:/ltr: لـ Tailwind CSS.",
          },
          components: {
            title: "مكونات واعية بالاتجاه",
            desc: "Row و Column و Navbar و Sidebar و Button و Icon والمزيد - كلها تدعم RTL.",
          },
        },
      },
    },
    fr: {
      common: {
        welcome: "Bienvenue sur BidiKit",
        tagline: "La couche manquante pour les applications web RTL et LTR",
        switchLanguage: "Changer de langue",
        currentLanguage: "Langue actuelle: {{lang}}",
        currentDirection: "Direction: {{dir}}",
        nav: {
          home: "Accueil",
          about: "À propos",
          docs: "Documentation",
        },
        hero: {
          title: "Construisez pour le Web mondial",
          subtitle:
            "BidiKit permet à toute application React ou Next.js de s'adapter automatiquement entre les mises en page LTR et RTL avec zéro configuration.",
          cta: "Commencer",
          docs: "Voir la doc",
        },
        features: {
          title: "Tout ce dont vous avez besoin pour une interface bidirectionnelle",
          direction: {
            title: "Direction automatique",
            desc: "Met à jour automatiquement document.dir, lang et les variables CSS lors du changement de langue.",
          },
          translation: {
            title: "Moteur de traduction",
            desc: "Clés imbriquées, pluralisation, interpolation, repli et chargement paresseux.",
          },
          tailwind: {
            title: "Plugin Tailwind",
            desc: "Utilitaires de propriétés logiques et variantes rtl:/ltr: pour Tailwind CSS.",
          },
          components: {
            title: "Composants directionnels",
            desc: "Row, Column, Navbar, Sidebar, Button, Icon et plus - tous compatibles RTL.",
          },
        },
      },
    },
  },
};

export default bidiConfig;
