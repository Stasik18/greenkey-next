import type { ReactNode } from "react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
