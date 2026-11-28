import { useEffect } from "react";

interface PizzelleMarkProps {
  className?: string;
  title?: string;
  ink?: string;
  paper?: string;
  edge?: string;
}

/** Procedural wafer. No external image. */
export default function PizzelleMark({
  className,
  title = "A five-inch pizzelle with a pressed floral pattern",
  ink = "#6d5436",
  paper = "#f4ead6",
  edge = "#c4a27a",
}: PizzelleMarkProps) {
  const scallops = 18;
  const steps = scallops * 8;
  let path = "";
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const radius = 46 + Math.sin(angle * scallops) * 2.4;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * radius;
    path += i === 0 ? `M ${x.toFixed(2)} ${y.toFixed(2)}` : ` L ${x.toFixed(2)} ${y.toFixed(2)}`;
  }
  path += " Z";

  return (
    <svg viewBox="0 0 100 100" className={className} role="img" aria-label={title}>
      <title>{title}</title>
      <path d={path} fill={paper} stroke={edge} strokeWidth="0.6" />
      <g fill="none" stroke={ink} strokeLinecap="round" opacity="0.9">
        {[14, 24, 34].map((radius) => (
          <circle key={radius} cx="50" cy="50" r={radius} strokeWidth="0.35" />
        ))}
        {Array.from({ length: 16 }).map((_, index) => {
          const angle = (index / 16) * Math.PI * 2;
          const x1 = 50 + Math.cos(angle) * 8;
          const y1 = 50 + Math.sin(angle) * 8;
          const x2 = 50 + Math.cos(angle) * 42;
          const y2 = 50 + Math.sin(angle) * 42;
          return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} strokeWidth="0.28" />;
        })}
        {Array.from({ length: 8 }).map((_, index) => {
          const angle = (index / 8) * Math.PI * 2;
          return (
            <ellipse
              key={index}
              cx={50 + Math.cos(angle) * 16}
              cy={50 + Math.sin(angle) * 16}
              rx="3.2"
              ry="8"
              transform={`rotate(${(angle * 180) / Math.PI} ${50 + Math.cos(angle) * 16} ${50 + Math.sin(angle) * 16})`}
              strokeWidth="0.4"
            />
          );
        })}
        <circle cx="50" cy="50" r="3.2" strokeWidth="0.45" />
      </g>
    </svg>
  );
}

export function useStylesheet(href: string) {
  useEffect(() => {
    if (document.querySelector(`link[data-asynd="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.dataset.asynd = href;
    document.head.appendChild(link);
  }, [href]);
}
