import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeAuthProvider } from "./context/ThemeAuthContext"; 
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <ThemeAuthProvider>
          <Toaster position="top-right" />
          {children}
        </ThemeAuthProvider>
      </body>
    </html>
  );
}
