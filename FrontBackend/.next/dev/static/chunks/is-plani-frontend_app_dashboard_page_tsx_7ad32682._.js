(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/is-plani-frontend/app/dashboard/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
// --- MOCK CONTEXT (Güvenli Çalıştırma İçin) ---
const ThemeAuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const ThemeAuthProvider = ({ children })=>{
    _s();
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const user = "girisimci@startera.com";
    const toggleTheme = ()=>setDarkMode(!darkMode);
    const logout = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success("Çıkış yapıldı");
        // Gerçek uygulamada burada logout mantığı olur
        window.location.href = "/login";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeAuthContext.Provider, {
        value: {
            user,
            darkMode,
            toggleTheme,
            logout
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: darkMode ? 'dark' : '',
            children: children
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 19,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 18,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeAuthProvider, "D2+2tCNohYwQ9K/tGnxPgGRQSlM=");
_c = ThemeAuthProvider;
const useThemeAuth = ()=>{
    _s1();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeAuthContext);
};
_s1(useThemeAuth, "gDsCjeeItUuvgOWf1v4qoK9RF6k=");
// --- ICONS ---
const MoonIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 26,
            columnNumber: 104
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 26,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
_c1 = MoonIcon;
const SunIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 27,
            columnNumber: 103
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 27,
        columnNumber: 24
    }, ("TURBOPACK compile-time value", void 0));
_c2 = SunIcon;
const HomeIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 28,
            columnNumber: 104
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 28,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
_c3 = HomeIcon;
const LockIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5 text-slate-400",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 29,
            columnNumber: 119
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 29,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
_c4 = LockIcon;
// --- CHATBOT BUTTON ---
const ChatbotButton = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 right-6 z-[60]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Asistan şu an müsait 🤖", {
                    icon: '👋',
                    style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff'
                    }
                }),
            className: "w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95 ring-4 ring-blue-500/20",
            children: "🤖"
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 35,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c5 = ChatbotButton;
// --- ÇEVİRİ SÖZLÜĞÜ ---
const TRANSLATIONS = {
    tr: {
        home: "Ana Sayfa",
        hello: "Merhaba",
        subtitle: "Bugün hangi harika fikri hayata geçirmek istersin?",
        new_plan_title: "İş Planı Oluştur",
        new_plan_desc: "Fikrini saniyeler içinde profesyonel bir iş planına dönüştür.",
        idea_title: "İş Fikri Üretici",
        idea_desc: "Pazar boşluklarını analiz ederek karlı girişim fikirleri önerir.",
        swot_title: "SWOT Analizi",
        swot_desc: "Girişiminin Güçlü, Zayıf yönlerini, Fırsatları ve Tehditleri profesyonelce raporlar.",
        deck_title: "Yatırımcı Sunumu",
        deck_desc: "Yatırımcılardan fon almanı sağlayacak 10 slaytlık profesyonel sunum taslağı hazırlar.",
        coming_soon: "YAKINDA",
        logout_btn: "Çıkış Yap",
        start_btn: "Hemen Başla",
        locked: "Kilitli Özellik"
    },
    en: {
        home: "Home",
        hello: "Hello",
        subtitle: "Which great idea do you want to bring to life today?",
        new_plan_title: "Create Business Plan",
        new_plan_desc: "Turn your idea into a professional business plan in seconds.",
        idea_title: "Business Idea Generator",
        idea_desc: "AI suggests profitable startup ideas by analyzing market gaps.",
        swot_title: "SWOT Analysis",
        swot_desc: "Analyze your startup's strengths, weaknesses, opportunities, and threats professionally.",
        deck_title: "Pitch Deck Creator",
        deck_desc: "Generate a professional 10-slide pitch deck draft to get funded.",
        coming_soon: "COMING SOON",
        logout_btn: "Logout",
        start_btn: "Start Now",
        locked: "Locked"
    },
    ar: {
        home: "الرئيسية",
        hello: "مرحباً",
        subtitle: "أي فكرة رائعة تريد تحقيقها اليوم؟",
        new_plan_title: "إنشاء خطة عمل",
        new_plan_desc: "حول فكرتك إلى خطة عمل احترافية في ثوانٍ.",
        idea_title: "مولد أفكار الأعمال",
        idea_desc: "يقترح الذكاء الاصطناعي أفكار عمل مربحة من خلال تحليل فجوات السوق.",
        swot_title: "تحليل SWOT",
        swot_desc: "حلل نقاط القوة والضعف والفرص والتهديدات لمشروعك بشكل احترافي.",
        deck_title: "عروض المستثمرين",
        deck_desc: "قم بإعداد مسودة عرض تقديمي احترافية للحصول على التمويل.",
        coming_soon: "قريباً",
        logout_btn: "تسجيل الخروج",
        start_btn: "ابدأ الآن",
        locked: "مغلق"
    }
};
// --- MAIN DASHBOARD CONTENT ---
function DashboardContent() {
    _s2();
    const { user, darkMode, toggleTheme, logout } = useThemeAuth();
    const [lang, setLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("tr");
    // Dil Yükleme
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DashboardContent.useEffect": ()=>{
            const savedLang = localStorage.getItem("app_lang");
            if (savedLang && [
                "tr",
                "en",
                "ar"
            ].includes(savedLang)) {
                setLang(savedLang);
            }
        }
    }["DashboardContent.useEffect"], []);
    const toggleLang = ()=>{
        let newLang = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
        setLang(newLang);
        localStorage.setItem("app_lang", newLang);
    };
    const getLangLabel = ()=>{
        if (lang === "tr") return "EN";
        if (lang === "en") return "AR";
        return "TR";
    };
    const t = TRANSLATIONS[lang];
    const dir = lang === "ar" ? "rtl" : "ltr";
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        dir: dir,
        className: `min-h-screen p-8 font-sans transition-all duration-700 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 133,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full blur-[130px] opacity-20 animate-pulse delay-1000 ${darkMode ? 'bg-purple-900' : 'bg-indigo-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 134,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full blur-[110px] opacity-15 animate-pulse delay-2000 ${darkMode ? 'bg-emerald-900' : 'bg-teal-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 135,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                lineNumber: 132,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                position: "top-center"
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatbotButton, {}, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                lineNumber: 139,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: `px-8 py-5 flex flex-col md:flex-row justify-between items-center backdrop-blur-lg sticky top-0 z-40 border-b mb-10 transition-colors rounded-2xl ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/",
                        className: "text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-80 transition cursor-pointer mb-4 md:mb-0 no-underline",
                        children: "Start ERA"
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 143,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/",
                                className: `flex items-center gap-2 font-bold text-sm px-4 py-2.5 rounded-xl border transition-all hover:shadow-lg no-underline ${darkMode ? 'border-slate-700 hover:bg-slate-800 text-slate-200' : 'border-slate-200 hover:bg-white text-slate-700 bg-white/50'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HomeIcon, {}, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: t.home
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                        lineNumber: 148,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                lineNumber: 147,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleLang,
                                className: "font-black text-lg hover:scale-110 transition active:scale-95 px-2",
                                title: "Change Language",
                                children: getLangLabel()
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                lineNumber: 151,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleTheme,
                                className: `p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm hover:shadow-md border border-slate-100'}`,
                                children: darkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SunIcon, {}, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 29
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MoonIcon, {}, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                    lineNumber: 154,
                                    columnNumber: 43
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                lineNumber: 153,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: logout,
                                className: "text-sm font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors",
                                children: t.logout_btn
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                lineNumber: 157,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: `text-4xl md:text-5xl font-black mb-3 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`,
                        children: [
                            t.hello,
                            ", ",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600",
                                children: user?.split('@')[0]
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                lineNumber: 165,
                                columnNumber: 24
                            }, this),
                            " 👋"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `mb-12 text-lg font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'}`,
                        children: t.subtitle
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 167,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid md:grid-cols-2 gap-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/planner",
                                className: `group relative p-1 rounded-[32px] bg-gradient-to-br from-blue-500 to-indigo-600 shadow-2xl hover:shadow-blue-500/30 transition-all hover:-translate-y-2 no-underline`,
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `relative h-full p-8 rounded-[30px] flex flex-col justify-between ${darkMode ? 'bg-slate-900' : 'bg-white'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-lg ${darkMode ? 'bg-slate-800 text-blue-400' : 'bg-blue-50 text-blue-600'}`,
                                                    children: "📄"
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                                    lineNumber: 175,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: `text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`,
                                                    children: t.new_plan_title
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                                    lineNumber: 176,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: `text-base leading-relaxed mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`,
                                                    children: t.new_plan_desc
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                                    lineNumber: 177,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 174,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `font-bold text-lg flex items-center gap-2 group-hover:gap-4 transition-all text-blue-600 ${lang === 'ar' ? 'flex-row-reverse' : ''}`,
                                            children: [
                                                t.start_btn,
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: lang === 'ar' ? 'rotate-180' : '',
                                                    children: "→"
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                                    lineNumber: 180,
                                                    columnNumber: 35
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 179,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                    lineNumber: 173,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                lineNumber: 172,
                                columnNumber: 11
                            }, this),
                            [
                                {
                                    icon: "💡",
                                    title: t.idea_title,
                                    desc: t.idea_desc,
                                    badge: "yellow"
                                },
                                {
                                    icon: "📊",
                                    title: t.swot_title,
                                    desc: t.swot_desc,
                                    badge: "orange"
                                },
                                {
                                    icon: "🎤",
                                    title: t.deck_title,
                                    desc: t.deck_desc,
                                    badge: "purple"
                                }
                            ].map((item, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `relative p-8 rounded-[32px] border border-dashed transition-all hover:bg-slate-50/50 dark:hover:bg-slate-900/50 ${darkMode ? 'bg-slate-900/40 border-slate-700' : 'bg-white/60 border-slate-300'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute top-5 right-5 text-white text-[10px] font-bold px-3 py-1 rounded-full animate-pulse uppercase tracking-wide shadow-lg ${item.badge === 'yellow' ? 'bg-yellow-500' : item.badge === 'orange' ? 'bg-orange-500' : 'bg-purple-500'}`,
                                            children: t.coming_soon
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 192,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-6 grayscale opacity-40 bg-slate-200 dark:bg-slate-800",
                                            children: item.icon
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: `text-xl font-bold mb-3 opacity-60 ${darkMode ? 'text-white' : 'text-slate-900'}`,
                                            children: item.title
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 199,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-sm opacity-50 mb-6 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`,
                                            children: item.desc
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 200,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LockIcon, {}, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 21
                                                }, this),
                                                " ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: t.locked
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                                    lineNumber: 203,
                                                    columnNumber: 34
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                            lineNumber: 202,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, idx, true, {
                                    fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 129,
        columnNumber: 5
    }, this);
}
_s2(DashboardContent, "oz2uLf4BRA1UdxILV07msn03HPM=", false, function() {
    return [
        useThemeAuth
    ];
});
_c6 = DashboardContent;
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeAuthProvider, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardContent, {}, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
            lineNumber: 217,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/dashboard/page.tsx",
        lineNumber: 216,
        columnNumber: 5
    }, this);
}
_c7 = App;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "ThemeAuthProvider");
__turbopack_context__.k.register(_c1, "MoonIcon");
__turbopack_context__.k.register(_c2, "SunIcon");
__turbopack_context__.k.register(_c3, "HomeIcon");
__turbopack_context__.k.register(_c4, "LockIcon");
__turbopack_context__.k.register(_c5, "ChatbotButton");
__turbopack_context__.k.register(_c6, "DashboardContent");
__turbopack_context__.k.register(_c7, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=is-plani-frontend_app_dashboard_page_tsx_7ad32682._.js.map