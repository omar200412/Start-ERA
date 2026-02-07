(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/is-plani-frontend/app/login/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/is-plani-frontend/node_modules/react-hot-toast/dist/index.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature(), _s2 = __turbopack_context__.k.signature();
"use client";
;
;
// --- API URL ---
const API_URL = typeof __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"] !== 'undefined' && __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env?.NEXT_PUBLIC_API_URL ? __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL : "http://127.0.0.1:8000";
// --- MOCK CONTEXT (Güvenli Çalıştırma İçin) ---
const ThemeAuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(null);
const ThemeAuthProvider = ({ children })=>{
    _s();
    const [darkMode, setDarkMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Initialize theme from localStorage
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeAuthProvider.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const savedTheme = localStorage.getItem("theme");
                if (savedTheme === "dark") {
                    setDarkMode(true);
                }
            }
        }
    }["ThemeAuthProvider.useEffect"], []);
    // Demo amaçlı basit login fonksiyonu
    const login = (token, email)=>{
        localStorage.setItem("token", token);
        localStorage.setItem("userEmail", email);
    };
    const toggleTheme = ()=>{
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeAuthContext.Provider, {
        value: {
            darkMode,
            toggleTheme,
            login
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: darkMode ? 'dark' : '',
            children: children
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
            lineNumber: 40,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThemeAuthProvider, "n2P3coCVngntCnyS/Nqj+dgR7+U=");
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
            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
            lineNumber: 47,
            columnNumber: 104
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
        lineNumber: 47,
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
            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
            lineNumber: 48,
            columnNumber: 103
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
        lineNumber: 48,
        columnNumber: 24
    }, ("TURBOPACK compile-time value", void 0));
_c2 = SunIcon;
// --- CHATBOT BUTTON ---
const ChatbotButton = ()=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed bottom-6 right-6 z-[60]",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            onClick: ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("Yardıma mı ihtiyacın var? 👋", {
                    icon: '🤖',
                    style: {
                        borderRadius: '12px',
                        background: '#333',
                        color: '#fff'
                    }
                }),
            className: "w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 transition active:scale-95 ring-4 ring-blue-500/20",
            children: "🤖"
        }, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
            lineNumber: 54,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
        lineNumber: 53,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_c3 = ChatbotButton;
// --- ÇEVİRİ SÖZLÜĞÜ ---
const TRANSLATIONS = {
    tr: {
        welcome: "Tekrar Hoşgeldin 👋",
        welcome_sub: "Girişimcilik yolculuğuna devam et.",
        join: "Aramıza Katıl 🚀",
        join_sub: "Hayallerini gerçeğe dönüştürmek için ilk adımı at.",
        email_label: "E-POSTA ADRESİ",
        pass_label: "ŞİFRE",
        email_ph: "ornek@mail.com",
        pass_ph: "••••••••",
        login_btn: "Giriş Yap",
        register_btn: "Ücretsiz Kayıt Ol",
        processing: "İşlem Yapılıyor...",
        no_account: "Henüz bir hesabın yok mu?",
        has_account: "Zaten bir hesabın var mı?",
        create_account: "Hemen Hesap Oluştur",
        login_account: "Mevcut Hesabına Giriş Yap",
        back_home: "← Ana Sayfaya Dön",
        success_login: "Giriş başarılı! Yönlendiriliyorsunuz...",
        success_register: "Kayıt başarılı! Şimdi giriş yapabilirsiniz.",
        err_generic: "İşlem başarısız oldu."
    },
    en: {
        welcome: "Welcome Back 👋",
        welcome_sub: "Continue your entrepreneurship journey.",
        join: "Join Us 🚀",
        join_sub: "Take the first step to turn your dreams into reality.",
        email_label: "EMAIL ADDRESS",
        pass_label: "PASSWORD",
        email_ph: "example@mail.com",
        pass_ph: "••••••••",
        login_btn: "Login",
        register_btn: "Sign Up Free",
        processing: "Processing...",
        no_account: "Don't have an account yet?",
        has_account: "Already have an account?",
        create_account: "Create Account Now",
        login_account: "Login to Existing Account",
        back_home: "← Back to Home",
        success_login: "Login successful! Redirecting...",
        success_register: "Registration successful! You can now login.",
        err_generic: "Operation failed."
    },
    ar: {
        welcome: "مرحباً بعودتك 👋",
        welcome_sub: "واصل رحلتك في ريادة الأعمال.",
        join: "انضم إلينا 🚀",
        join_sub: "اتخذ الخطوة الأولى لتحويل أحلامك إلى حقيقة.",
        email_label: "البريد الإلكتروني",
        pass_label: "كلمة المرور",
        email_ph: "example@mail.com",
        pass_ph: "••••••••",
        login_btn: "تسجيل الدخول",
        register_btn: "سجل مجاناً",
        processing: "جاري المعالجة...",
        no_account: "ليس لديك حساب بعد؟",
        has_account: "هل لديك حساب بالفعل؟",
        create_account: "أنشئ حساباً الآن",
        login_account: "تسجيل الدخول للحساب الحالي",
        back_home: "← العودة للرئيسية",
        success_login: "تم تسجيل الدخول بنجاح! جاري التوجيه...",
        success_register: "تم التسجيل بنجاح! يمكنك تسجيل الدخول الآن.",
        err_generic: "فشلت العملية."
    }
};
// --- AUTH PAGE CONTENT ---
function AuthPageContent() {
    _s2();
    const { login, darkMode, toggleTheme } = useThemeAuth();
    const [lang, setLang] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("tr");
    const [isLogin, setIsLogin] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        email: "",
        password: ""
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthPageContent.useEffect": ()=>{
            const savedLang = localStorage.getItem("app_lang");
            if (savedLang && [
                "tr",
                "en",
                "ar"
            ].includes(savedLang)) {
                setLang(savedLang);
            }
        }
    }["AuthPageContent.useEffect"], []);
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
    const handleAuth = async (e)=>{
        e.preventDefault();
        setLoading(true);
        const endpoint = isLogin ? "/login" : "/register";
        try {
            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.detail || t.err_generic);
            if (isLogin) {
                login(data.token, form.email);
                __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(t.success_login);
                setTimeout(()=>window.location.href = "/dashboard", 1500);
            } else {
                __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].success(t.success_register);
                setIsLogin(true);
            }
        } catch (error) {
            __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].error(error.message || t.err_generic);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        dir: dir,
        className: `min-h-screen flex items-center justify-center p-6 font-sans transition-all duration-700 relative overflow-hidden ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$react$2d$hot$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Toaster"], {
                position: "top-center"
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                lineNumber: 195,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ChatbotButton, {}, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                lineNumber: 196,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 -z-10 overflow-hidden pointer-events-none",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-20 animate-pulse ${darkMode ? 'bg-blue-900' : 'bg-blue-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                        lineNumber: 200,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute top-[40%] -right-[10%] w-[50%] h-[70%] rounded-full blur-[130px] opacity-20 animate-pulse delay-1000 ${darkMode ? 'bg-purple-900' : 'bg-indigo-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                        lineNumber: 201,
                        columnNumber: 10
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `absolute -bottom-[20%] left-[20%] w-[70%] h-[50%] rounded-full blur-[110px] opacity-15 animate-pulse delay-2000 ${darkMode ? 'bg-emerald-900' : 'bg-teal-300'}`
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                        lineNumber: 202,
                        columnNumber: 10
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                lineNumber: 199,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-6 right-6 flex items-center gap-3 z-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleLang,
                        className: "font-black text-lg hover:scale-110 transition active:scale-95 w-10 text-center",
                        title: "Change Language",
                        children: getLangLabel()
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                        lineNumber: 207,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: toggleTheme,
                        className: `p-2.5 rounded-xl transition-all active:scale-95 ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-white text-slate-600 shadow-sm hover:shadow-md border border-slate-100'}`,
                        children: darkMode ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SunIcon, {}, void 0, false, {
                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                            lineNumber: 209,
                            columnNumber: 25
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MoonIcon, {}, void 0, false, {
                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                            lineNumber: 209,
                            columnNumber: 39
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                lineNumber: 206,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-full max-w-md p-[1px] rounded-[32px] bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/30 shadow-2xl animate-in fade-in zoom-in-95 duration-700`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-full p-10 rounded-[31px] backdrop-blur-2xl transition-all ${darkMode ? 'bg-slate-900/90 border border-slate-800' : 'bg-white/90 border border-white/50'}`,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center mb-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                    href: "/",
                                    className: "text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight block mb-6 hover:opacity-80 transition no-underline",
                                    children: "Start ERA"
                                }, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 218,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: `text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`,
                                    children: isLogin ? t.welcome : t.join
                                }, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 221,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-sm font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`,
                                    children: isLogin ? t.welcome_sub : t.join_sub
                                }, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 224,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                            lineNumber: 217,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleAuth,
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `text-xs font-bold uppercase ml-1 tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`,
                                            children: t.email_label
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                            lineNumber: 231,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `absolute -inset-0.5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 bg-gradient-to-r from-blue-600 to-purple-600`
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                    lineNumber: 233,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    required: true,
                                                    className: `relative w-full p-4 rounded-2xl border-none outline-none transition-all ${darkMode ? 'bg-slate-950 text-white placeholder:text-slate-600' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'}`,
                                                    placeholder: t.email_ph,
                                                    value: form.email,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            email: e.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                    lineNumber: 234,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                            lineNumber: 232,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 230,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: `text-xs font-bold uppercase ml-1 tracking-wider ${darkMode ? 'text-slate-400' : 'text-slate-500'}`,
                                            children: t.pass_label
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                            lineNumber: 246,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "relative group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: `absolute -inset-0.5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500 bg-gradient-to-r from-blue-600 to-purple-600`
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                    lineNumber: 248,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "password",
                                                    required: true,
                                                    className: `relative w-full p-4 rounded-2xl border-none outline-none transition-all ${darkMode ? 'bg-slate-950 text-white placeholder:text-slate-600' : 'bg-slate-50 text-slate-900 placeholder:text-slate-400'}`,
                                                    placeholder: t.pass_ph,
                                                    value: form.password,
                                                    onChange: (e)=>setForm({
                                                            ...form,
                                                            password: e.target.value
                                                        })
                                                }, void 0, false, {
                                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                            lineNumber: 247,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 245,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: loading,
                                    className: `group relative w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden ${isLogin ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                            lineNumber: 265,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "relative z-10 flex items-center justify-center gap-2",
                                            children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                        className: "animate-spin h-5 w-5 text-white",
                                                        xmlns: "http://www.w3.org/2000/svg",
                                                        fill: "none",
                                                        viewBox: "0 0 24 24",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                                className: "opacity-25",
                                                                cx: "12",
                                                                cy: "12",
                                                                r: "10",
                                                                stroke: "currentColor",
                                                                strokeWidth: "4"
                                                            }, void 0, false, {
                                                                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 141
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                className: "opacity-75",
                                                                fill: "currentColor",
                                                                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            }, void 0, false, {
                                                                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                                lineNumber: 269,
                                                                columnNumber: 242
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                                        lineNumber: 269,
                                                        columnNumber: 25
                                                    }, this),
                                                    t.processing
                                                ]
                                            }, void 0, true) : isLogin ? t.login_btn : t.register_btn
                                        }, void 0, false, {
                                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                            lineNumber: 266,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 260,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                            lineNumber: 229,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `mt-8 pt-6 border-t text-center ${darkMode ? 'border-slate-800' : 'border-slate-100'}`,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: `text-xs mb-3 font-medium ${darkMode ? 'text-slate-500' : 'text-slate-400'}`,
                                    children: isLogin ? t.no_account : t.has_account
                                }, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 278,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        setIsLogin(!isLogin);
                                        setForm({
                                            email: "",
                                            password: ""
                                        });
                                    },
                                    className: "text-blue-600 font-black hover:underline transition text-sm hover:text-blue-500",
                                    children: isLogin ? t.create_account : t.login_account
                                }, void 0, false, {
                                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                            lineNumber: 277,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mt-6 text-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: "/",
                                className: `text-xs font-bold hover:underline transition no-underline ${darkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`,
                                children: t.back_home
                            }, void 0, false, {
                                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                                lineNumber: 293,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                            lineNumber: 292,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                    lineNumber: 215,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/is-plani-frontend/app/login/page.tsx",
                lineNumber: 214,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_s2(AuthPageContent, "NEuuZAJls3Hehkl15rzv3+vp5UM=", false, function() {
    return [
        useThemeAuth
    ];
});
_c4 = AuthPageContent;
function App() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeAuthProvider, {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$is$2d$plani$2d$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthPageContent, {}, void 0, false, {
            fileName: "[project]/is-plani-frontend/app/login/page.tsx",
            lineNumber: 306,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/is-plani-frontend/app/login/page.tsx",
        lineNumber: 305,
        columnNumber: 5
    }, this);
}
_c5 = App;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "ThemeAuthProvider");
__turbopack_context__.k.register(_c1, "MoonIcon");
__turbopack_context__.k.register(_c2, "SunIcon");
__turbopack_context__.k.register(_c3, "ChatbotButton");
__turbopack_context__.k.register(_c4, "AuthPageContent");
__turbopack_context__.k.register(_c5, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=is-plani-frontend_app_login_page_tsx_e27df359._.js.map