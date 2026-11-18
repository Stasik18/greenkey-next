import Script from "next/script";

const importMap = {
  imports: {
    three: "/assets/vendor/three/three.module.min.js",
    "three/addons/": "/assets/vendor/three/addons/",
  },
};

export function HomePageScripts() {
  return (
    <>
      <script
        type="importmap"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(importMap) }}
      />
      <Script
        src="/assets/js/build3d/index.js"
        type="module"
        strategy="afterInteractive"
      />
    </>
  );
}
