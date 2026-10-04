import type { Asset, DrawOp, ImageAvailability } from "../../../core/scene";
import { renderAsset } from "../../../core/scene";

/**
 * Sprite atom (M4-T1).
 *
 * Renders a core `DrawOp` (or a list of them) as an SVG primitive, or an
 * `Asset` via core `renderAsset` (external image when available, procedural
 * fallback otherwise). It is thin and dumb: it contains no draw logic itself —
 * every op comes from core, and it only maps each op to its SVG element.
 */
export interface SpriteProps {
  /** Draw ops to render directly. */
  ops?: readonly DrawOp[];
  /** An asset to render via core `renderAsset` (image + procedural fallback). */
  asset?: Asset;
  /** External-image availability predicate (delegated to core `renderAsset`). */
  imageAvailable?: ImageAvailability;
}

/** Map a single core draw op to its SVG primitive. */
export function DrawOpElement({ op }: { op: DrawOp }) {
  switch (op.type) {
    case "rect":
      return (
        <rect
          x={op.x}
          y={op.y}
          width={op.w}
          height={op.h}
          fill={op.fill ?? "none"}
          stroke={op.stroke}
          strokeWidth={op.strokeWidth}
          rx={op.rx}
        />
      );
    case "ellipse":
      return (
        <ellipse
          cx={op.cx}
          cy={op.cy}
          rx={op.rx}
          ry={op.ry}
          fill={op.fill ?? "none"}
          stroke={op.stroke}
          strokeWidth={op.strokeWidth}
        />
      );
    case "line":
      return (
        <line
          x1={op.x1}
          y1={op.y1}
          x2={op.x2}
          y2={op.y2}
          stroke={op.stroke}
          strokeWidth={op.strokeWidth}
        />
      );
    case "text":
      return (
        <text
          x={op.x}
          y={op.y}
          fill={op.fill}
          fontSize={op.fontSize}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {op.text}
        </text>
      );
    case "image":
      return (
        <image
          x={op.x}
          y={op.y}
          width={op.w}
          height={op.h}
          href={op.src}
          preserveAspectRatio="xMidYMid meet"
        />
      );
  }
}

export function Sprite({
  ops,
  asset,
  imageAvailable = () => false,
}: SpriteProps) {
  const drawOps = asset ? renderAsset(asset, imageAvailable) : (ops ?? []);
  return (
    <>
      {drawOps.map((op, i) => (
        <DrawOpElement key={i} op={op} />
      ))}
    </>
  );
}
