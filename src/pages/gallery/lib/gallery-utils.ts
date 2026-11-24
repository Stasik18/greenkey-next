import { STAGES } from "../model/gallery-data";
import type { House, Photo } from "../model/gallery-data";

function plural(count: number, one: string, few: string, many: string) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo > 10 && lastTwo < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

export function count(house: House, key: string) {
  return (
    house.photos[key] || (house as unknown as Record<string, number>)[key] || 0
  );
}

function photoPath(house: House, key: string, index: number, thumb = false) {
  const suffix = thumb ? "-t" : "";
  return `${house.dir}${key}-${String(index + 1).padStart(2, "0")}${suffix}.webp`;
}

export function getGroupPhotos(
  house: House,
  key: string,
  label: string,
): Photo[] {
  const amount =
    key === "project"
      ? count(house, "project") + count(house, "plan")
      : count(house, key);

  return Array.from({ length: amount }, (_, index) => {
    const isPlan = key === "project" && index >= count(house, "project");
    const photoKey = isPlan ? "plan" : key;
    const photoIndex = isPlan ? index - count(house, "project") : index;

    return {
      src: photoPath(house, photoKey, photoIndex),
      alt: `${label} - ${house.model}, фото ${index + 1} из ${amount}`,
    };
  });
}

export function getPhotoSummary(house: House) {
  const total = Object.values(house.photos).reduce(
    (sum, value) => sum + value,
    0,
  );
  const completedStages = STAGES.filter(
    (stage) => count(house, stage.key) > 0,
  ).length;

  if (completedStages === STAGES.length) {
    return `Фотоотчёт - ${total} ${plural(total, "кадр", "кадра", "кадров")} по всем семи этапам.`;
  }

  if (house.status === "progress") {
    return `Фотоотчёт - ${total} ${plural(total, "кадр", "кадра", "кадров")}, съёмка продолжается.`;
  }

  return `Фотоотчёт - ${total} ${plural(total, "кадр", "кадра", "кадров")}, снято ${completedStages} ${plural(completedStages, "этап", "этапа", "этапов")} из ${STAGES.length}.`;
}
