 import dynamic from "next/dynamic";
import { Metadata } from "next";

 const ECommerce = dynamic(() => import("@/components/Dashboard/E-commerce"), {
  ssr: false,
});

export const metadata: Metadata = {
  title: "Hotel Dashboard Page | NextAdmin - Next.js Dashboard Kit",
  description: "This is Next.js Home page for Hotel Dashboard Kit",
};

export default function Home() {
  return <ECommerce />;
}
