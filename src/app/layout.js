import { Suspense } from "react";

import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import AppToaster from "@/component/UI/AppToaster";



const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "FX currency converter",
  description: "Frontend Mentor project #71",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">

        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={null}>
              <CurrencyProvider>
                {children}
              </CurrencyProvider>
            </Suspense>
          </AuthProvider>
        </ThemeProvider>
        <AppToaster />
        
      </body>
    </html>
  );
}
