"use client";

import { useEffect, useRef } from "react";

/**
 * Background video for the hero. Muted, looping, no controls.
 * Under prefers-reduced-motion it never plays and the poster frame stands in,
 * so the hero is a still photograph rather than motion the viewer did not ask for.
 */
export default function HeroVideo({ src, poster }: { src: string; poster: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => {
      if (reduce.matches) {
        v.pause();
        v.removeAttribute("src");
        v.load();
      } else if (!v.src) {
        v.src = src;
        v.play().catch(() => {});
      }
    };
    apply();
    reduce.addEventListener("change", apply);
    return () => reduce.removeEventListener("change", apply);
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      className="absolute inset-0 size-full object-cover"
    />
  );
}
