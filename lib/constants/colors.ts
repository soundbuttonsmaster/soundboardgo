// Kid-friendly colors for sound cards
export const SOUND_COLORS = [
  { name: "Sky Blue", value: "sky", bg: "bg-sky-400", hover: "hover:bg-sky-500", text: "text-sky-900", hex: "#38bdf8" },
  {
    name: "Rose Pink",
    value: "rose",
    bg: "bg-rose-400",
    hover: "hover:bg-rose-500",
    text: "text-rose-900",
    hex: "#fb7185",
  },
  {
    name: "Lime Green",
    value: "lime",
    bg: "bg-lime-400",
    hover: "hover:bg-lime-500",
    text: "text-lime-900",
    hex: "#a3e635",
  },
  {
    name: "Amber Yellow",
    value: "amber",
    bg: "bg-amber-400",
    hover: "hover:bg-amber-500",
    text: "text-amber-900",
    hex: "#fbbf24",
  },
  {
    name: "Violet",
    value: "violet",
    bg: "bg-violet-400",
    hover: "hover:bg-violet-500",
    text: "text-violet-900",
    hex: "#a78bfa",
  },
  { name: "Cyan", value: "cyan", bg: "bg-cyan-400", hover: "hover:bg-cyan-500", text: "text-cyan-900", hex: "#22d3ee" },
  {
    name: "Orange",
    value: "orange",
    bg: "bg-orange-400",
    hover: "hover:bg-orange-500",
    text: "text-orange-900",
    hex: "#fb923c",
  },
  {
    name: "Emerald",
    value: "emerald",
    bg: "bg-emerald-400",
    hover: "hover:bg-emerald-500",
    text: "text-emerald-900",
    hex: "#34d399",
  },
  {
    name: "Fuchsia",
    value: "fuchsia",
    bg: "bg-fuchsia-400",
    hover: "hover:bg-fuchsia-500",
    text: "text-fuchsia-900",
    hex: "#e879f9",
  },
  { name: "Teal", value: "teal", bg: "bg-teal-400", hover: "hover:bg-teal-500", text: "text-teal-900", hex: "#2dd4bf" },
  { name: "Red", value: "red", bg: "bg-red-500", hover: "hover:bg-red-600", text: "text-red-900", hex: "#ef4444" },
  { name: "Blue", value: "blue", bg: "bg-blue-500", hover: "hover:bg-blue-600", text: "text-blue-900", hex: "#3b82f6" },
  {
    name: "Green",
    value: "green",
    bg: "bg-green-500",
    hover: "hover:bg-green-600",
    text: "text-green-900",
    hex: "#22c55e",
  },
  {
    name: "Yellow",
    value: "yellow",
    bg: "bg-yellow-400",
    hover: "hover:bg-yellow-500",
    text: "text-yellow-900",
    hex: "#facc15",
  },
  {
    name: "Purple",
    value: "purple",
    bg: "bg-purple-500",
    hover: "hover:bg-purple-600",
    text: "text-purple-900",
    hex: "#a855f7",
  },
  { name: "Gray", value: "gray", bg: "bg-gray-400", hover: "hover:bg-gray-500", text: "text-gray-900", hex: "#9ca3af" },
] as const

export type SoundColor = (typeof SOUND_COLORS)[number]["value"]

export function getColorClasses(color: string) {
  const found = SOUND_COLORS.find((c) => c.value === color)
  return found || SOUND_COLORS[0]
}

export function getColorHex(color: string): string {
  const found = SOUND_COLORS.find((c) => c.value === color)
  return found?.hex || "#38bdf8" // Default to sky blue
}
