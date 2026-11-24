import { GalleryInteractive } from "./GalleryInteractive";
import { GalleryHeader } from "./components/GalleryHeader";
import { GalleryNote } from "./components/GalleryNote";

export function GalleryPage() {
  return (
    <GalleryInteractive header={<GalleryHeader />} footer={<GalleryNote />} />
  );
}
