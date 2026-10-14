/** YouTube/Facebook link -> iframe src. Returns null for anything we don't recognise. */
export function embedSrc(url: string): string | null {
  const u = url.trim();

  const yt =
    u.match(/youtube\.com\/.*[?&]v=([\w-]{6,})/) ??
    u.match(/youtu\.be\/([\w-]{6,})/) ??
    u.match(/youtube\.com\/(?:embed|shorts|live)\/([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;

  if (/facebook\.com|fb\.watch/.test(u)) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(u)}&show_text=false`;
  }

  if (/vimeo\.com\/(\d+)/.test(u)) {
    return `https://player.vimeo.com/video/${u.match(/vimeo\.com\/(\d+)/)![1]}`;
  }

  return null;
}

/** YouTube thumbnail, so video tiles have a preview without loading an iframe. */
export function embedPoster(url: string): string | null {
  const yt =
    url.match(/youtube\.com\/.*[?&]v=([\w-]{6,})/) ??
    url.match(/youtu\.be\/([\w-]{6,})/) ??
    url.match(/youtube\.com\/(?:embed|shorts|live)\/([\w-]{6,})/);
  return yt ? `https://img.youtube.com/vi/${yt[1]}/hqdefault.jpg` : null;
}
