import {
  HeroSection,
  StatsSection,
  KarkasSection,
  RepairSection,
  Build3DSection,
  ProcessSection,
  ServicesSection,
  PartnersSection,
  GallerySection,
  VacanciesSection,
  ContactsSection,
} from "./sections";

export function HomePage() {
  return (
    <main>
      <div className="relative overflow-hidden bg-ink">
        <HeroSection />
        <StatsSection />
      </div>
      <KarkasSection />
      <RepairSection />
      <Build3DSection />
      <ProcessSection />
      <ServicesSection />
      <PartnersSection />
      <GallerySection />
      <VacanciesSection />
      <ContactsSection />
    </main>
  );
}
