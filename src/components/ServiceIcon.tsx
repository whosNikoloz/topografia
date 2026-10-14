import {
  Compass,
  Cube,
  DroneIcon,
  MapTrifold,
  Mountains,
  Path,
  Ruler,
  Stack,
  Target,
  TrendUp,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";

// One icon family, one stroke weight, picked from the keys the admin can choose.
const ICONS: Record<string, Icon> = {
  map: MapTrifold,
  ruler: Ruler,
  target: Target,
  cube: Cube,
  drone: DroneIcon,
  chart: TrendUp,
  layers: Stack,
  pin: Compass,
  terrain: Mountains,
  path: Path,
};

export const ICON_KEYS = Object.keys(ICONS);

export default function ServiceIcon({ name, size = 26 }: { name: string; size?: number }) {
  const Glyph = ICONS[name] ?? ICONS.map;
  return <Glyph size={size} weight="light" aria-hidden />;
}
