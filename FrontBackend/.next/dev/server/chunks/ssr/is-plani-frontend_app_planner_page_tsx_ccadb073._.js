module.exports = [
"[project]/is-plani-frontend/app/planner/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/react-hot-toast/dist/index.mjs [app-ssr] (ecmascript)");
"use client";
;
;
;
// --- API URL ---
const API_URL = typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL : "http://127.0.0.1:8000";
// --- ÇEVİRİ SÖZLÜĞÜ ---
const TRANSLATIONS = {
    tr: {
        nav_back: "Vazgeç",
        step_progress: "İlerleme Durumu",
        step: "Adım",
        back: "Geri",
        next: "Devam Et",
        start_magic: "Sihri Başlat",
        generating: "Plan Yazılıyor...",
        success_title: "İş Planın Hazır!",
        success_desc: (idea)=>`Yapay zeka, "${idea}" fikrin için stratejiyi oluşturdu.`,
        download_pdf: "PDF Olarak İndir",
        new_plan: "Yeni Plan Oluştur",
        toast_success: "İş planınız başarıyla oluşturuldu!",
        toast_error: "Bir hata oluştu",
        toast_pdf_preparing: "PDF hazırlanıyor...",
        toast_pdf_success: "PDF İndirildi!",
        toast_pdf_error: "PDF oluşturulamadı.",
        err_empty: "Bu alan boş bırakılamaz.",
        err_capital: "Lütfen geçerli bir tutar girin.",
        err_short: "Yapay zekanın iyi çalışması için biraz daha detay verin.",
        loading_messages: [
            "Pazar verileri taranıyor...",
            "Rakip analizi yapılıyor...",
            "Finansal projeksiyonlar hesaplanıyor...",
            "SWOT tablosu oluşturuluyor...",
            "Yatırımcı sunumu için strateji belirleniyor...",
            "Son dokunuşlar yapılıyor ✨"
        ],
        questions: [
            {
                id: 1,
                key: "idea",
                title: "Hayalindeki Girişim Nedir?",
                subtitle: "Bize fikrinden bahset, gerisini yapay zekaya bırak.",
                ph: "Örn: Kadıköy'de sadece plak çalan ve 3. dalga kahve satan retro bir mekan..."
            },
            {
                id: 2,
                key: "capital",
                title: "Mevcut Gücün (Sermaye)",
                subtitle: "Başlangıç için ne kadar kaynağa sahibiz?",
                ph: "Örn: 500.000 TL nakit ve 2 yatırımcı ortağım var..."
            },
            {
                id: 3,
                key: "skills",
                title: "Süper Güçlerin",
                subtitle: "Ekibin hangi konularda uzman?",
                ph: "Örn: 10 yıllık barista tecrübesi, dijital pazarlama uzmanlığı..."
            },
            {
                id: 4,
                key: "strategy",
                title: "Gelecek Vizyonun",
                subtitle: "1 yıl sonra kendini nerede görüyorsun?",
                ph: "Örn: 3 şubeye ulaşmak ve kendi kahve markamı marketlerde satmak..."
            },
            {
                id: 5,
                key: "management",
                title: "Yönetim Kadrosu",
                subtitle: "Gemiyi kimler yönetiyor?",
                ph: "Örn: Ben operasyonu, ortağım finansı yönetecek..."
            }
        ]
    },
    en: {
        nav_back: "Cancel",
        step_progress: "Progress",
        step: "Step",
        back: "Back",
        next: "Continue",
        start_magic: "Start Magic",
        generating: "Writing Plan...",
        success_title: "Business Plan Ready!",
        success_desc: (idea)=>`AI has created a strategy for your "${idea}" idea.`,
        download_pdf: "Download PDF",
        new_plan: "Create New Plan",
        toast_success: "Business plan created successfully!",
        toast_error: "An error occurred",
        toast_pdf_preparing: "Preparing PDF...",
        toast_pdf_success: "PDF Downloaded!",
        toast_pdf_error: "Could not generate PDF.",
        err_empty: "This field cannot be empty.",
        err_capital: "Please enter a valid amount.",
        err_short: "Please provide a bit more detail for better AI results.",
        loading_messages: [
            "Scanning market data...",
            "Analyzing competitors...",
            "Calculating financial projections...",
            "Creating SWOT table...",
            "Strategizing for investor pitch...",
            "Adding final touches ✨"
        ],
        questions: [
            {
                id: 1,
                key: "idea",
                title: "What is your Startup Idea?",
                subtitle: "Tell us about your idea, leave the rest to AI.",
                ph: "Ex: A retro place in Kadıköy selling only vinyls and 3rd wave coffee..."
            },
            {
                id: 2,
                key: "capital",
                title: "Current Power (Capital)",
                subtitle: "How much resources do we have to start?",
                ph: "Ex: 500,000 TL cash and 2 investor partners..."
            },
            {
                id: 3,
                key: "skills",
                title: "Superpowers",
                subtitle: "What is your team expert in?",
                ph: "Ex: 10 years barista experience, digital marketing expertise..."
            },
            {
                id: 4,
                key: "strategy",
                title: "Future Vision",
                subtitle: "Where do you see yourself in 1 year?",
                ph: "Ex: Reaching 3 branches and selling my own coffee brand in markets..."
            },
            {
                id: 5,
                key: "management",
                title: "Management Crew",
                subtitle: "Who is steering the ship?",
                ph: "Ex: I manage operations, my partner manages finance..."
            }
        ]
    },
    ar: {
        nav_back: "إلغاء",
        step_progress: "التقدم",
        step: "خطوة",
        back: "عودة",
        next: "استمرار",
        start_magic: "ابدأ السحر",
        generating: "جاري كتابة الخطة...",
        success_title: "خطة العمل جاهزة!",
        success_desc: (idea)=>`قام الذكاء الاصطناعي بإنشاء استراتيجية لفكرتك "${idea}".`,
        download_pdf: "تحميل PDF",
        new_plan: "إنشاء خطة جديدة",
        toast_success: "تم إنشاء خطة العمل بنجاح!",
        toast_error: "حدث خطأ",
        toast_pdf_preparing: "جاري تحضير PDF...",
        toast_pdf_success: "تم تحميل PDF!",
        toast_pdf_error: "تعذر إنشاء PDF.",
        err_empty: "لا يمكن ترك هذا الحقل فارغًا.",
        err_capital: "يرجى إدخال مبلغ صالح.",
        err_short: "يرجى تقديم مزيد من التفاصيل للحصول على نتائج أفضل.",
        loading_messages: [
            "جاري مسح بيانات السوق...",
            "تحليل المنافسين...",
            "حساب التوقعات المالية...",
            "إنشاء جدول SWOT...",
            "وضع استراتيجية لعرض المستثمرين...",
            "إضافة اللمسات الأخيرة ✨"
        ],
        questions: [
            {
                id: 1,
                key: "idea",
                title: "ما هي فكرة مشروعك الناشئ؟",
                subtitle: "أخبرنا عن فكرتك، واترك الباقي للذكاء الاصطناعي.",
                ph: "مثال: مكان ريترو في كاديكوي يبيع فقط الاسطوانات والقهوة المختصة..."
            },
            {
                id: 2,
                key: "capital",
                title: "القوة الحالية (رأس المال)",
                subtitle: "كم لدينا من الموارد للبدء؟",
                ph: "مثال: 500,000 ليرة تركية نقدًا وشريكان مستثمران..."
            },
            {
                id: 3,
                key: "skills",
                title: "القوى الخارقة",
                subtitle: "بماذا يتميز فريقك؟",
                ph: "مثال: 10 سنوات خبرة باريستا، خبرة في التسويق الرقمي..."
            },
            {
                id: 4,
                key: "strategy",
                title: "الرؤية المستقبلية",
                subtitle: "أين ترى نفسك بعد عام واحد؟",
                ph: "مثال: الوصول إلى 3 فروع وبيع علامتي التجارية للقهوة في الأسواق..."
            },
            {
                id: 5,
                key: "management",
                title: "طاقم الإدارة",
                subtitle: "من يقود السفينة؟",
                ph: "مثال: أنا أدير العمليات، وشريكي يدير الشؤون المالية..."
            }
        ]
    }
};
// --- MOCK CONTEXT ---
const ThemeAuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const ThemeAuthProvider = ({ children })=>{
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const user = "girisimci@startera.com";
    const toggleTheme = ()=>setDarkMode(!darkMode);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeAuthContext.Provider, {
        value: {
            user,
            darkMode,
            toggleTheme
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: darkMode ? 'dark' : '',
            children: children
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
            lineNumber: 131,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 130,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
const useThemeAuth = ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeAuthContext);
// --- ICONS ---
const MoonIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
            lineNumber: 138,
            columnNumber: 104
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 138,
        columnNumber: 25
    }, ("TURBOPACK compile-time value", void 0));
const SunIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
            strokeWidth: 2
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
            lineNumber: 139,
            columnNumber: 103
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 139,
        columnNumber: 24
    }, ("TURBOPACK compile-time value", void 0));
const SparkleIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5 animate-pulse",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z"
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
            lineNumber: 140,
            columnNumber: 121
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 140,
        columnNumber: 28
    }, ("TURBOPACK compile-time value", void 0));
// --- TYPEWRITER EFFECT ---
const TypewriterEffect = ({ text, speed = 5 })=>{
    const [displayedText, setDisplayedText] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let i = 0;
        const timer = setInterval(()=>{
            if (i < text.length) {
                setDisplayedText((prev)=>prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
        return ()=>clearInterval(timer);
    }, [
        text,
        speed
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "whitespace-pre-wrap leading-relaxed",
        children: displayedText
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 159,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
// --- CHATBOT BUTTON ---
const ChatbotButton = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 right-6 z-[60]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"])("Asistan şu an analiz yapıyor 🤖", {
                    icon: '⏳',
                    style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff'
                    }
                }),
            className: "w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95 ring-4 ring-blue-500/20",
            children: "🤖"
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
            lineNumber: 166,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// --- LOADING OVERLAY ---
const LoadingOverlay = ({ messages })=>{
    const [message, setMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(messages[0]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        let i = 0;
        const interval = setInterval(()=>{
            setMessage(messages[i % messages.length]);
            i++;
        }, 2000);
        return ()=>clearInterval(interval);
    }, [
        messages
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl rounded-3xl transition-all duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-24 h-24 mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-2 border-r-4 border-purple-500 rounded-full animate-spin",
                        style: {
                            animationDirection: 'reverse',
                            animationDuration: '2s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 flex items-center justify-center text-3xl",
                        children: "🚀"
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 animate-pulse",
                children: "Start ERA AI"
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "mt-2 text-sm text-slate-500 font-medium animate-fade-in",
                children: message
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 190,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
// --- MAIN PAGE CONTENT ---
function PlannerContent() {
    const { user, darkMode, toggleTheme } = useThemeAuth();
    const [lang, setLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("tr"); // Dil State
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [planResult, setPlanResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        idea: "",
        capital: "",
        skills: "",
        strategy: "",
        management: "",
        language: "tr"
    });
    // Dil Yükleme ve Kaydetme
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const savedLang = localStorage.getItem("app_lang");
        if (savedLang && [
            "tr",
            "en",
            "ar"
        ].includes(savedLang)) {
            setLang(savedLang);
            setFormData((prev)=>({
                    ...prev,
                    language: savedLang
                }));
        }
    }, []);
    const toggleLang = ()=>{
        let newLang = lang === "tr" ? "en" : lang === "en" ? "ar" : "tr";
        setLang(newLang);
        setFormData((prev)=>({
                ...prev,
                language: newLang
            }));
        localStorage.setItem("app_lang", newLang);
    };
    const getLangLabel = ()=>{
        if (lang === "tr") return "EN";
        if (lang === "en") return "AR";
        return "TR";
    };
    // Seçili dile ait metinleri al
    const t = TRANSLATIONS[lang];
    const dir = lang === "ar" ? "rtl" : "ltr";
    const validateInput = (key, value)=>{
        const val = value.trim();
        if (!val) return t.err_empty;
        if (key === "capital" && val.length < 2) return t.err_capital;
        if (key !== "capital" && val.length < 5) return t.err_short;
        return null;
    };
    const handleNext = ()=>{
        const currentKey = t.questions[step - 1].key;
        const err = validateInput(currentKey, formData[currentKey]);
        if (err) {
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(err);
            return;
        }
        if (step < 5) setStep(step + 1);
        else generatePlan();
    };
    const handleKeyDown = (e)=>{
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleNext();
        }
    };
    const generatePlan = async ()=>{
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/generate_plan`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                let errMsg = "Bağlantı hatası";
                try {
                    const e = await res.json();
                    errMsg = e.detail || e.message;
                } catch  {}
                throw new Error(errMsg);
            }
            const data = await res.json();
            setPlanResult(data.plan);
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(t.toast_success, {
                duration: 5000,
                icon: '🎉'
            });
        } catch (error) {
            console.error(error);
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(t.toast_error);
            // Fallback for demo
            setPlanResult(`EXECUTIVE SUMMARY:
(Demo Mode - API Error)

BUSINESS IDEA:
${formData.idea}

STRATEGY:
${formData.strategy}

[${lang.toUpperCase()}] This is a preview text generated because the API connection failed.`);
        } finally{
            setLoading(false);
        }
    };
    const downloadPDF = async ()=>{
        if (!planResult) return;
        const tid = __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].loading(t.toast_pdf_preparing);
        try {
            const res = await fetch(`${API_URL}/create_pdf`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    text: planResult
                })
            });
            if (!res.ok) throw new Error("PDF Error");
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "StartERA_Plan.pdf";
            document.body.appendChild(a);
            a.click();
            a.remove();
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].success(t.toast_pdf_success);
        } catch  {
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].error(t.toast_pdf_error);
        } finally{
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].dismiss(tid);
        }
    };
    if (!user) return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen items-center justify-center text-slate-500",
        children: "Lütfen giriş yapın."
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 321,
        columnNumber: 21
    }, this);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        dir: dir,
        className: `min-h-screen transition-all duration-700 relative overflow-hidden ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 328,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full blur-[130px] opacity-20 animate-pulse delay-1000 ${darkMode ? 'bg-purple-900' : 'bg-indigo-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 329,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full blur-[110px] opacity-15 animate-pulse delay-2000 ${darkMode ? 'bg-emerald-900' : 'bg-teal-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 330,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 327,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toaster"], {
                position: "top-center",
                toastOptions: {
                    style: {
                        background: darkMode ? '#1e293b' : '#fff',
                        color: darkMode ? '#fff' : '#333',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }
                }
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 333,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatbotButton, {}, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 334,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: `px-8 py-5 flex justify-between items-center backdrop-blur-lg sticky top-0 z-40 border-b transition-colors ${darkMode ? "bg-slate-900/60 border-slate-800" : "bg-white/60 border-slate-200"}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/30",
                                children: "S"
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 339,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600",
                                children: "Start ERA"
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 340,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 338,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleLang,
                                className: "font-black text-lg hover:scale-110 transition active:scale-95",
                                title: "Change Language",
                                children: getLangLabel()
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 343,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: toggleTheme,
                                className: `p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm hover:shadow-md border border-slate-100'}`,
                                children: darkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SunIcon, {}, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 345,
                                    columnNumber: 29
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MoonIcon, {}, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 345,
                                    columnNumber: 43
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 344,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/dashboard",
                                className: `px-5 py-2.5 rounded-xl font-bold text-sm border transition-all hover:shadow-lg no-underline active:scale-95 ${darkMode ? "border-slate-700 hover:bg-slate-800 text-slate-200" : "border-slate-200 hover:bg-white text-slate-900 bg-white/50"}`,
                                children: t.nav_back
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 347,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 342,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col items-center justify-center p-6 w-full max-w-5xl mx-auto min-h-[calc(100vh-80px)]",
                children: planResult ? /* --- RESULT VIEW (Sonuç Ekranı) --- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative w-full p-[1px] rounded-[32px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-700`,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-full p-8 md:p-12 rounded-[31px] backdrop-blur-2xl ${darkMode ? "bg-slate-900/90" : "bg-white/90"}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "text-center mb-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-green-400 to-emerald-600 text-white text-4xl mb-6 shadow-lg shadow-green-500/30 animate-bounce",
                                        children: "🎉"
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 362,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: `text-4xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`,
                                        children: t.success_title
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 365,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: `text-lg font-medium ${darkMode ? 'text-slate-300' : 'text-slate-700'}`,
                                        children: t.success_desc(formData.idea.substring(0, 25) + "...")
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 368,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 361,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `relative p-8 md:p-14 rounded-2xl shadow-inner overflow-y-auto max-h-[60vh] mb-10 font-serif text-base leading-loose border transition-colors scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600 ${darkMode ? "bg-slate-950 border-slate-800 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-900"}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70"
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 376,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TypewriterEffect, {
                                        text: planResult,
                                        speed: 3
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 377,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 374,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row gap-5 justify-center items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: downloadPDF,
                                        className: "group relative px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-1 w-full sm:w-auto overflow-hidden",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                                            }, void 0, false, {
                                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                lineNumber: 385,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "flex items-center justify-center gap-2 relative z-10",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "w-5 h-5 group-hover:animate-bounce",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        viewBox: "0 0 24 24",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            strokeWidth: 2,
                                                            d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                            lineNumber: 387,
                                                            columnNumber: 139
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                        lineNumber: 387,
                                                        columnNumber: 33
                                                    }, this),
                                                    t.download_pdf
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                lineNumber: 386,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 381,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setPlanResult(null);
                                            setStep(1);
                                            setFormData({
                                                ...formData,
                                                idea: ""
                                            });
                                        },
                                        className: `px-8 py-4 rounded-xl font-bold border transition-all w-full sm:w-auto hover:scale-105 active:scale-95 ${darkMode ? "border-slate-700 hover:bg-slate-800 text-slate-300" : "border-slate-200 hover:bg-slate-50 text-slate-700"}`,
                                        children: t.new_plan
                                    }, void 0, false, {
                                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                        lineNumber: 392,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 380,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                        lineNumber: 359,
                        columnNumber: 17
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                    lineNumber: 358,
                    columnNumber: 13
                }, this) : /* --- FORM VIEW (Soru Ekranı) --- */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `relative w-full max-w-3xl transition-all duration-500`,
                    children: [
                        loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LoadingOverlay, {
                            messages: t.loading_messages
                        }, void 0, false, {
                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                            lineNumber: 404,
                            columnNumber: 29
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex justify-between mb-3 px-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-bold text-blue-600 uppercase tracking-widest",
                                    children: t.step_progress
                                }, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 408,
                                    columnNumber: 20
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `text-xs font-bold ${darkMode ? 'text-slate-400' : 'text-slate-700'}`,
                                    children: [
                                        t.step,
                                        " ",
                                        step,
                                        " / 5"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 409,
                                    columnNumber: 20
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                            lineNumber: 407,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-full bg-slate-200 rounded-full h-2 mb-10 dark:bg-slate-800 overflow-hidden",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.6)]",
                                style: {
                                    width: `${step / 5 * 100}%`
                                }
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                lineNumber: 412,
                                columnNumber: 21
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                            lineNumber: 411,
                            columnNumber: 17
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `relative p-8 md:p-12 rounded-[32px] shadow-2xl backdrop-blur-xl border transition-all duration-500 ${darkMode ? "bg-slate-900/80 border-slate-800 shadow-black/50" : "bg-white/80 border-white/60 shadow-blue-900/5"}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-8 animate-in slide-in-from-bottom-2 fade-in duration-500",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: `text-3xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`,
                                            children: t.questions[step - 1].title
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 419,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: `text-lg md:text-xl font-medium ${darkMode ? "text-slate-300" : "text-slate-700"}`,
                                            children: t.questions[step - 1].subtitle
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 422,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, step, true, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 418,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative group",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `absolute -inset-0.5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 bg-gradient-to-r from-blue-600 to-purple-600`
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 428,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            rows: 6,
                                            className: `relative w-full p-6 rounded-2xl border-none outline-none text-xl resize-none shadow-inner transition-all ${darkMode ? "bg-slate-950 text-white placeholder:text-slate-500 focus:bg-slate-900" : "bg-slate-100 text-slate-900 placeholder:text-slate-600 focus:bg-white"}`,
                                            placeholder: t.questions[step - 1].ph,
                                            value: formData[t.questions[step - 1].key],
                                            onChange: (e)=>setFormData({
                                                    ...formData,
                                                    [t.questions[step - 1].key]: e.target.value
                                                }),
                                            onKeyDown: handleKeyDown,
                                            autoFocus: true
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 429,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 427,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex justify-between items-center mt-12",
                                    children: [
                                        step > 1 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setStep(step - 1),
                                            className: `px-6 py-3 font-bold rounded-xl transition-colors ${darkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-700 hover:text-black hover:bg-slate-200'}`,
                                            children: [
                                                lang === "ar" ? "→" : "←",
                                                " ",
                                                t.back
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 442,
                                            columnNumber: 29
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {}, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 445,
                                            columnNumber: 29
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleNext,
                                            disabled: loading,
                                            className: `group relative px-10 py-4 rounded-xl font-bold text-white shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${loading ? 'bg-slate-600' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "flex items-center gap-2 relative z-10",
                                                    children: step === 5 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SparkleIcon, {}, void 0, false, {
                                                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                                lineNumber: 456,
                                                                columnNumber: 41
                                                            }, this),
                                                            t.start_magic
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            t.next,
                                                            " ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: `group-hover:translate-x-1 transition-transform inline-block ${lang === "ar" ? "rotate-180" : ""}`,
                                                                children: "→"
                                                            }, void 0, false, {
                                                                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                                lineNumber: 460,
                                                                columnNumber: 48
                                                            }, this)
                                                        ]
                                                    }, void 0, true)
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                                    lineNumber: 453,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                            lineNumber: 447,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                                    lineNumber: 440,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                            lineNumber: 416,
                            columnNumber: 17
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                    lineNumber: 403,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
                lineNumber: 354,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 324,
        columnNumber: 5
    }, this);
}
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeAuthProvider, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlannerContent, {}, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
            lineNumber: 477,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/planner/page.tsx",
        lineNumber: 476,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=is-plani-frontend_app_planner_page_tsx_ccadb073._.js.map