import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeAuthProvider } from "./context/ThemeAuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Start ERA — AI Powered Entrepreneurship",
  description: "Turn your idea into a business plan in seconds.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeAuthProvider>
          <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
          {children}
        </ThemeAuthProvider>
      </body>
    </html>
  );
}