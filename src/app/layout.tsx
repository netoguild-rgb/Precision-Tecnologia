import type { Metadata } from "next";
import { Inter, Ubuntu_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ClientProviders } from "@/components/layout/ClientProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ubuntuMono = Ubuntu_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Precision Tecnologia | Produtos Huawei Enterprise",
  description:
    "E-commerce de produtos Huawei Enterprise: switches, roteadores, access points, GBICs, patch cords, patch panels e conectores. Pronta entrega e sob encomenda.",
  keywords: [
    "Huawei",
    "switches",
    "roteadores",
    "access points",
    "Wi-Fi 6",
    "Wi-Fi 7",
    "GBIC",
    "SFP",
    "patch cord",
    "patch panel",
    "conectores",
    "networking",
    "infraestrutura de rede",
  ],
  openGraph: {
    title: "Precision Tecnologia | Produtos Huawei Enterprise",
    description:
      "Switches, roteadores, APs, GBICs, patch cords e conectores Huawei. Pronta entrega e vendas internacionais.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${ubuntuMono.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg)]">
        <ClientProviders>
          <Header />
          <main className="flex-1">{children}</main>
        </ClientProviders>
        <Footer />
      </body>
    </html>
  );
}

