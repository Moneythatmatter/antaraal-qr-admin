import { Playfair_Display } from "next/font/google";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { AdminProvider } from "@/context/AdminContext";
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
        <AdminProvider>
          <div className="flex flex-col md:flex-row h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
              <Header />
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                {children}
              </div>
            </main>
            <MobileNav />
          </div>
        </AdminProvider>
      </body>
    </html>
  );
}
