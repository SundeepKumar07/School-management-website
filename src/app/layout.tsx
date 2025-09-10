import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ToastContainer, toast } from 'react-toastify';

export const metadata: Metadata = {
  title: "SMS",
  description: "Learning Next.js step by step",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ToastContainer/>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
