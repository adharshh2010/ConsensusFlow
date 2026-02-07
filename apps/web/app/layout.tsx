import { Metadata } from "next/types";
import { Poppins, Ubuntu } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@workspace/ui/components/sonner";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

const ubuntu = Ubuntu({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-ubuntu",
});

export const metadata: Metadata = {
  title: {
    default: "ConsensusFlow",
    template: "%s | ConsensusFlow",
  },
  description: "Trust what is True with Proof. - ConsensusFlow",
  authors: [{ name: "Adharsh", url: "" }],
  icons: {
    icon: "/favicon.ico",
    href: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <body
        className={`${poppins.variable} ${ubuntu.variable} ${poppins.style}${ubuntu.className} ${ubuntu.style} font-ubuntu antialiased `}
      >
        <Toaster richColors closeButton />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
