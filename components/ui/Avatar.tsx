interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  online?: boolean;
}

const sizes = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-xl",
};

const indicatorSizes = {
  sm: "w-2 h-2",
  md: "w-2.5 h-2.5",
  lg: "w-3 h-3",
  xl: "w-3.5 h-3.5",
};

function getInitials(name: string) {
  if (!name || typeof name !== "string") {
    return "?";
  }
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Avatar({
  src,
  name = "User",
  size = "md",
  online,
}: AvatarProps) {
  return (
    <div className="relative flex-shrink-0">
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-[var(--glass-border)]`}
        />
      ) : (
        <div
          className={`
            ${sizes[size]} rounded-full
            bg-gradient-to-br from-sky-500 to-blue-600
            flex items-center justify-center
            text-white font-bold
            ring-2 ring-[var(--glass-border)]
          `}
        >
          {getInitials(name)}
        </div>
      )}

      {online !== undefined && (
        <span
          className={`
            absolute -bottom-0.5 -right-0.5
            ${indicatorSizes[size]} rounded-full
            border-2 border-[var(--bg-base)]
            ${online ? "bg-emerald-400" : "bg-slate-400"}
          `}
        />
      )}
    </div>
  );
}
