import { prefersReducedMotion } from "./browser-utils";

const TYPEWRITER_PHRASES = [
  "Каркасные дома под ключ",
  "Ремонт и отделка",
  "Дизайн-проекты",
  "Строим мечты в реальность",
];

export function initTypewriter() {
  const element = document.getElementById("typewriter");
  if (!element || prefersReducedMotion()) return () => {};

  let phraseIndex = 0;
  let characterIndex = 0;
  let isDeleting = false;
  let timeout = 0;

  const type = () => {
    const phrase = TYPEWRITER_PHRASES[phraseIndex];

    if (!isDeleting) {
      characterIndex += 1;
      element.textContent = phrase.slice(0, characterIndex);

      if (characterIndex === phrase.length) {
        isDeleting = true;
        timeout = window.setTimeout(type, 2000);
        return;
      }
    } else {
      characterIndex -= 1;
      element.textContent = phrase.slice(0, characterIndex);

      if (characterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % TYPEWRITER_PHRASES.length;
      }
    }

    timeout = window.setTimeout(type, isDeleting ? 45 : 75);
  };

  timeout = window.setTimeout(type, 1600);
  return () => window.clearTimeout(timeout);
}
