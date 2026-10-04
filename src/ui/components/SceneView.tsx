import type {
  RenderState,
  Asset,
  Character,
  ImageAvailability,
  Wall,
  Window,
  WallDecor,
  FloorDecal,
} from "../../core/scene";
import { Sprite } from "./atoms/Sprite";

export interface SceneViewProps {
  /** The ordered render state to draw. */
  renderState: RenderState;
  /** The scene world size, used for the SVG viewBox. */
  world: { w: number; h: number };
  /** External-image availability predicate (delegated to core `renderAsset`). */
  imageAvailable?: ImageAvailability;
}

/** Render an asset via core `renderAsset` (image when available, else procedural). */
function AssetElement({
  asset,
  imageAvailable,
}: {
  asset: Asset;
  imageAvailable: ImageAvailability;
}) {
  return (
    <g data-asset={asset.id}>
      <Sprite asset={asset} imageAvailable={imageAvailable} />
    </g>
  );
}

/** Render a wall segment (face + top). */
function WallElement({ wall }: { wall: Wall }) {
  return (
    <g data-wall={wall.id}>
      <rect x={wall.x} y={wall.y} width={wall.w} height={wall.h} fill={wall.face} />
      <rect
        x={wall.x}
        y={wall.y - wall.height}
        width={wall.w}
        height={wall.height}
        fill={wall.top}
      />
    </g>
  );
}

/** Render a window on a wall. */
function WindowElement({ win }: { win: Window }) {
  return (
    <g data-window={win.id}>
      <rect
        x={win.x}
        y={win.y}
        width={win.w}
        height={win.h}
        fill="#bfe8ff"
        stroke="#8f9bb3"
        strokeWidth={2}
      />
      <line
        x1={win.x + win.w / 2}
        y1={win.y}
        x2={win.x + win.w / 2}
        y2={win.y + win.h}
        stroke="#8f9bb3"
        strokeWidth={2}
      />
    </g>
  );
}

/** Render a wall decoration (whiteboard/clock/poster) procedurally. */
function WallDecorElement({ decor }: { decor: WallDecor }) {
  const w = decor.w ?? 60;
  const h = decor.h ?? 40;
  const asset: Asset = {
    id: decor.id,
    asset: decor.asset,
    x: decor.x,
    y: decor.y,
    w,
    h,
    r: decor.r,
    ink: decor.ink,
    color: decor.color,
  };
  return <AssetElement asset={asset} imageAvailable={() => false} />;
}

/** Render a floor decal (rug/zone) procedurally. */
function FloorDecalElement({ decal }: { decal: FloorDecal }) {
  const asset: Asset = {
    id: decal.id,
    asset: decal.asset,
    x: decal.x,
    y: decal.y,
    w: decal.w,
    h: decal.h,
    color: decal.color,
    trim: decal.trim,
    label: decal.label,
  };
  return <AssetElement asset={asset} imageAvailable={() => false} />;
}

/** A small emotion glyph shown above a character's head. */
const EMOTION_GLYPH: Record<string, string> = {
  neutral: "·",
  happy: "☺",
  excited: "★",
  nervous: "~",
  surprised: "!",
  shy: "☁",
  confident: "▲",
  proud: "♛",
  sad: "☹",
  annoyed: "#",
  thinking: "?",
};

/** Render a character with its look palette and current emotion. */
function CharacterElement({ character }: { character: Character }) {
  const { x, y, look, emotion } = character;
  const cx = x;
  const cy = y;
  const body = 26;
  const headR = 11;
  const headCy = cy - body - headR;
  return (
    <g data-character={character.id} transform={`translate(${cx},${cy})`}>
      {/* legs / shoes */}
      <rect x={-8} y={-body + 8} width={7} height={10} fill={look.pants} />
      <rect x={1} y={-body + 8} width={7} height={10} fill={look.pants} />
      <rect x={-9} y={-body + 16} width={9} height={4} fill={look.shoes} rx={1} />
      <rect x={0} y={-body + 16} width={9} height={4} fill={look.shoes} rx={1} />
      {/* torso / shirt */}
      <rect x={-11} y={-body} width={22} height={14} fill={look.shirt} rx={3} />
      <rect x={-11} y={-body} width={22} height={6} fill={look.shirt2} rx={3} />
      {/* head */}
      <circle cx={0} cy={headCy} r={headR} fill={look.skin} />
      <path
        d={`M ${-headR} ${headCy + headR * 0.4} Q 0 ${headCy - headR * 1.2} ${headR} ${headCy + headR * 0.4} Z`}
        fill={look.hair}
      />
      {/* emotion glyph */}
      <text
        y={headCy - headR - 6}
        textAnchor="middle"
        fontSize={12}
        fill="#2b3550"
      >
        {EMOTION_GLYPH[emotion] ?? EMOTION_GLYPH.neutral}
      </text>
    </g>
  );
}

/**
 * SceneView (M1-T4b).
 *
 * A dumb, thin component that renders a core `RenderState` as SVG. It draws the
 * static background layers (floor, corridor, back walls, windows, door, wall
 * decor, floor decals, light patches) first, then the foreground objects in
 * paint order (assets, front walls, visible characters). All geometry and draw
 * operations come from core — no business logic lives here.
 */
export function SceneView({
  renderState,
  world,
  imageAvailable = () => false,
}: SceneViewProps) {
  const { background, objects } = renderState;

  return (
    <svg
      viewBox={`0 0 ${world.w} ${world.h}`}
      width={world.w}
      height={world.h}
      role="img"
      aria-label="Scene"
      className="block h-auto w-full"
    >
      {/* floor */}
      <rect
        x={background.floor.x}
        y={background.floor.y}
        width={background.floor.w}
        height={background.floor.h}
        fill={background.floor.base}
      />
      {/* corridor */}
      <rect
        x={background.corridor.x}
        y={background.corridor.y}
        width={background.corridor.w}
        height={background.corridor.h}
        fill={background.corridor.color}
      />
      {/* back walls */}
      {background.walls
        .filter((wall) => wall.layer === "back")
        .map((wall) => (
          <WallElement key={wall.id} wall={wall} />
        ))}
      {/* windows */}
      {background.windows.map((win) => (
        <WindowElement key={win.id} win={win} />
      ))}
      {/* door */}
      <g data-door={background.door.id}>
        <rect
          x={background.door.x}
          y={background.door.y}
          width={background.door.w}
          height={background.door.h}
          fill={background.door.frame}
        />
        <text
          x={background.door.x + background.door.w / 2}
          y={background.door.y + background.door.h / 2}
          textAnchor="middle"
          dominantBaseline="central"
          fontSize={8}
          fill="#fff"
        >
          {background.door.label}
        </text>
      </g>
      {/* wall decor */}
      {background.wallDecor.map((decor) => (
        <WallDecorElement key={decor.id} decor={decor} />
      ))}
      {/* floor decals */}
      {background.floorDecals.map((decal) => (
        <FloorDecalElement key={decal.id} decal={decal} />
      ))}
      {/* light patches */}
      {background.lightPatches.map((patch, i) => (
        <polygon
          key={i}
          points={`${patch.x},${background.floor.y} ${patch.x + patch.w},${background.floor.y} ${patch.x + patch.w + 60},${background.floor.y + 300} ${patch.x - 60},${background.floor.y + 300}`}
          fill="#fff"
          opacity={0.14}
        />
      ))}

      {/* foreground objects in paint order */}
      {objects.map((obj, i) => {
        if (obj.kind === "asset" && obj.asset) {
          return <AssetElement key={i} asset={obj.asset} imageAvailable={imageAvailable} />;
        }
        if (obj.kind === "wall" && obj.wall) {
          return <WallElement key={i} wall={obj.wall} />;
        }
        if (obj.kind === "character" && obj.character) {
          return <CharacterElement key={i} character={obj.character} />;
        }
        return null;
      })}
    </svg>
  );
}
