import { useMemo } from "react";
import { loadOfficeScene } from "../../../data/officeScene";
import { computeInitialState } from "../../../core/scene";
import { CharacterCard } from "../../components/molecules";
import { ShowcaseEntry } from "../ShowcaseEntry";

/**
 * Showcase entry for the `CharacterCard` molecule (M4-T5).
 *
 * Demonstrates the card for the first visible character of the office scene at
 * t=0. It is thin and dumb — it only derives a character from core and renders
 * the molecule with it.
 */
export function CharacterCardShowcase() {
  const character = useMemo(() => {
    const scene = loadOfficeScene();
    return computeInitialState(scene).characters[0];
  }, []);

  return (
    <ShowcaseEntry
      name="CharacterCard"
      props="character: CharacterState"
      description="Shows a character's look palette, emotion and active say bubble via the Sprite atom."
    >
      {character && <CharacterCard character={character} />}
    </ShowcaseEntry>
  );
}
