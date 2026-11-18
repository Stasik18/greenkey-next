import "./home.css";

import {
  AmbassadorSection,
  BuildSection,
  ContactsSection,
  GallerySection,
  HeroSection,
  KarkasSection,
  MarqueeSection,
  NumbersSection,
  PartnersSection,
  PaymentSection,
  ProcessSection,
  RepairSection,
  ServicesSection,
  VacanciesSection,
} from "./sections";
import { HomeDialogs } from "./HomeDialogs";
import { HomePageScripts } from "./HomePageScripts";
import { HomePageEffects } from "./HomePageEffects";

function PageEffects() {
  return (
    <>
      <div
        id="grain"
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] opacity-[0.025]"
      />
      <div
        id="progress"
        aria-hidden="true"
        className="fixed left-0 top-0 z-[120] h-0.5 w-0 bg-brand-green"
      />
      <div id="preloader" aria-hidden="true" className="preloader">
        <span className="font-heading text-2xl font-black">
          Зелёный <span className="text-brand-green">ключ</span>
        </span>
      </div>
    </>
  );
}

export function HomePage() {
  return (
    <>
      <PageEffects />
      <main>
        <HeroSection />
        <NumbersSection />
        <AmbassadorSection />
        <MarqueeSection />
        <KarkasSection />
        <RepairSection />
        <BuildSection />
        <ProcessSection />
        <ServicesSection />
        <PaymentSection />
        <PartnersSection />
        <GallerySection />
        <VacanciesSection />
        <ContactsSection />
      </main>
      <HomeDialogs />
      <HomePageEffects />
      <HomePageScripts />
    </>
  );
}
