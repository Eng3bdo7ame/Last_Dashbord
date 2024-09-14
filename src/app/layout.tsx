"use client";
import React from "react";
 import "jsvectormap/dist/css/jsvectormap.css";
 import "@/css/style.css";
import DefaultLayout from "@/components/Layouts/DefaultLaout";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 

  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning={true}>
        {  <DefaultLayout>{children}</DefaultLayout>}
      </body>
    </html>
  );
}
