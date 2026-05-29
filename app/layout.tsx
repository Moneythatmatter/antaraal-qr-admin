import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata = {
  title: "Antaraal Resort & Spa | Admin Console",
  description: "Experience the calm and luxury of Antaraal through our digital experience.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full bg-background flex flex-col text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
