import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-raleway",
});

export const metadata: Metadata = {
  title: "Frontline Youth Creativity Initiative | Empowering Youth Through Creative Expression",
  description: "FYCI empowers young people with creative skills, mentorship, and opportunities to transform their communities and build brighter futures.",
  keywords: ["youth", "creativity", "non-profit", "education", "mentorship", "community", "empowerment"],
  authors: [{ name: "Frontline Youth Creativity Initiative" }],
  openGraph: {
    title: "Frontline Youth Creativity Initiative",
    description: "Empowering youth through creative expression and community engagement",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${raleway.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
