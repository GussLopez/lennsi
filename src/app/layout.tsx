import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Providers from "./Providers";
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const lora = Lora({ subsets: ['latin'], variable: '--font-lora' });

export const metadata: Metadata = {
  title: "Lennsi | Conecta tu restaurante con NFC",
  description: "Conecta tu menú, promociones y redes sociales con etiquetas NFC. Gestiona sucursales, enlaces e interacciones de tu restaurante desde Lennsi",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("h-full antialiased font-sans", inter.variable, lora.variable)}
    >
      <Providers>
        <body className="min-h-full flex flex-col">
          {children}
          <Toaster />
        </body>
      </Providers>
    </html>
  );
}
