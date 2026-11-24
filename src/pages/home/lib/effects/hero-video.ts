import { isConnectionLimited, prefersReducedMotion } from "./browser-utils";

export function initHeroVideo() {
  const video = document.querySelector<HTMLVideoElement>(".hero-bg-video");
  if (!video || prefersReducedMotion() || isConnectionLimited())
    return () => {};

  const isDesktop = window.matchMedia("(min-width: 769px)").matches;
  const source = isDesktop
    ? video.dataset.src
    : (video.dataset.srcMobile ?? video.dataset.src);

  if (!source) return () => {};

  const playbackRate = Number(video.dataset.speed) || 1;
  const applyPlaybackRate = () => {
    video.playbackRate = playbackRate;
  };

  if (isDesktop && video.dataset.poster) {
    video.poster = video.dataset.poster;
  }

  video.addEventListener("loadeddata", applyPlaybackRate);
  video.addEventListener("play", applyPlaybackRate);
  video.src = source;
  video.load();
  void video.play().catch(() => {});

  return () => {
    video.pause();
    video.removeEventListener("loadeddata", applyPlaybackRate);
    video.removeEventListener("play", applyPlaybackRate);
    video.removeAttribute("src");
    video.load();
  };
}
