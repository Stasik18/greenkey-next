import type { ReactNode } from "react";

import { Header } from "@/widgets/header";
import { Footer } from "@/widgets/footer";
import { CallButton } from "@/widgets/call-button";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <CallButton />
    </>
  );
}
