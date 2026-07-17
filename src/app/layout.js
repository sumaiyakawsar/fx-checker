import { Suspense } from "react";

import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { ThemeProvider } from "@/context/ThemeContext";



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
          <Suspense fallback={null}>
            <CurrencyProvider>

              {children}

            </CurrencyProvider>
          </Suspense>

        </ThemeProvider>
      </body>
    </html>
  );
}
