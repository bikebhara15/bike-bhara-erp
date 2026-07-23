import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bike Bhara ERP",
  description: "Bike rental management system",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="bn">
      <body>{children}</body>
    </html>
  );
}
