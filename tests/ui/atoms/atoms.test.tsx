import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Button } from "../../../src/ui/components/atoms/Button";
import { Slider } from "../../../src/ui/components/atoms/Slider";
import { Badge } from "../../../src/ui/components/atoms/Badge";
import { Sprite } from "../../../src/ui/components/atoms/Sprite";
import type { Asset, DrawOp } from "../../../src/core/scene";

describe("Button atom (M4-T1)", () => {
  it("renders its children and forwards clicks", () => {
    const onClick = vi.fn();
    const { getByText, getByRole } = render(
      <Button onClick={onClick} ariaLabel="Play">Play</Button>,
    );
    expect(getByText("Play")).toBeTruthy();
    fireEvent.click(getByRole("button", { name: "Play" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("defaults to the primary variant and applies primary classes", () => {
    const { container } = render(<Button>Go</Button>);
    const btn = container.querySelector("button")!;
    expect(btn.className).toContain("bg-indigo-600");
  });

  it("applies secondary variant classes", () => {
    const { container } = render(<Button variant="secondary">Step</Button>);
    const btn = container.querySelector("button")!;
    expect(btn.className).toContain("border-slate-300");
  });

  it("disables the button when disabled", () => {
    const { container } = render(<Button disabled>Go</Button>);
    expect(container.querySelector("button")!.disabled).toBe(true);
  });
});

describe("Slider atom (M4-T1)", () => {
  it("renders a range input with value/min/max/step and forwards numeric changes", () => {
    const onChange = vi.fn();
    const { getByLabelText } = render(
      <Slider value={12.5} min={0} max={41} step={0.1} onChange={onChange} ariaLabel="Seek" />,
    );
    const input = getByLabelText("Seek") as HTMLInputElement;
    expect(input.type).toBe("range");
    expect(input.value).toBe("12.5");
    expect(input.min).toBe("0");
    expect(input.max).toBe("41");
    expect(input.step).toBe("0.1");
    fireEvent.change(input, { target: { value: "20" } });
    expect(onChange).toHaveBeenCalledWith(20);
  });

  it("defaults the step to 1", () => {
    const { getByLabelText } = render(
      <Slider value={0} min={0} max={10} onChange={() => {}} ariaLabel="Seek" />,
    );
    expect((getByLabelText("Seek") as HTMLInputElement).step).toBe("1");
  });
});

describe("Badge atom (M4-T1)", () => {
  it("renders its label children", () => {
    const { getByText } = render(<Badge>0.0s / 41.0s</Badge>);
    expect(getByText("0.0s / 41.0s")).toBeTruthy();
  });

  it("defaults to the pill tone", () => {
    const { container } = render(<Badge>New</Badge>);
    expect(container.querySelector("span")!.className).toContain("rounded-full");
  });

  it("applies the muted tone", () => {
    const { container } = render(<Badge tone="muted">0.0s / 41.0s</Badge>);
    expect(container.querySelector("span")!.className).toContain("font-mono");
  });
});

describe("Sprite atom (M4-T1)", () => {
  it("renders a list of core draw ops as SVG primitives", () => {
    const ops: DrawOp[] = [
      { type: "rect", x: 0, y: 0, w: 10, h: 5, fill: "#f00" },
      { type: "text", x: 5, y: 5, text: "hi", fill: "#000" },
    ];
    const { container } = render(
      <svg>
        <Sprite ops={ops} />
      </svg>,
    );
    expect(container.querySelector("rect[fill='#f00']")).not.toBeNull();
    expect(container.querySelector("text")).not.toBeNull();
  });

  it("renders an asset via core renderAsset with an image when available", () => {
    const asset: Asset = {
      id: "a", asset: "desk", x: 10, y: 20, image: "/desk.png",
    };
    const { container } = render(
      <svg>
        <Sprite asset={asset} imageAvailable={(src) => src === "/desk.png"} />
      </svg>,
    );
    const img = container.querySelector("image")!;
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("href", "/desk.png");
  });

  it("falls back to procedural drawing when the image is unavailable", () => {
    const asset: Asset = {
      id: "a", asset: "desk", x: 10, y: 20, image: "/missing.png",
    };
    const { container } = render(
      <svg>
        <Sprite asset={asset} imageAvailable={() => false} />
      </svg>,
    );
    expect(container.querySelector("image")).toBeNull();
    expect(container.querySelector("rect")).not.toBeNull();
  });
});
