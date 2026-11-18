import Image from "next/image";

import type { House } from "../../../model/gallery-data";

export function ViewerHero({ house }: { house: House }) {
  return (
    <div className="vw-hero">
      <Image
        unoptimized
        src={house.cover}
        alt={house.model}
        fill
        sizes="100vw"
        priority
      />
      <div className="vw-hero-cap">
        <div className="inner">
          <span
            className={`status${house.status === "progress" ? " is-progress" : ""}`}
          >
            <i />
            {house.year ? `Объект сдан · ${house.year}` : "Объект сдан"}
          </span>
          <h2>{house.model}</h2>
          <div className="addr">⌖ {house.address}</div>
        </div>
      </div>
    </div>
  );
}
