import * as stylex from "@stylexjs/stylex";

// Raw palette. Use only from color.stylex.ts, never from a component.
export const palette = stylex.defineVars({
  // Outline and text
  ink900: "#22223a",
  ink700: "#303047", // art: outline
  ink500: "#4a4c63",
  ink400: "#63657a",
  ink300: "#85879a",
  ink200: "#9a9cae",
  ink100: "#c9cad4",

  // Grounds
  paper0: "#fffefb",
  paper50: "#faf9f3",
  paper100: "#f7f6f0",
  paper200: "#eeefe6",
  paper300: "#e3e4da",
  paper400: "#dbdcd3",
  paper500: "#c9cabe",
  cream: "#f4eddc", // art: cream

  // Primary actions, success, health
  sage100: "#deebdc",
  sage200: "#c3dcc8",
  sage300: "#9bb9a2", // art: sage
  sage400: "#758d80", // art: sage-shadow
  sage500: "#6f9a7d",
  sage700: "#3c644a",
  sageLight: "#d5dfb5", // art: sage-light

  // Blades and metal
  steel: "#c5cede", // art: steel

  // Info, mana, rare
  indigo100: "#dfe6f4",
  indigo200: "#c2cbe4",
  indigo300: "#9b9fbc", // art: indigo-light
  indigo500: "#747da7", // art: indigo
  indigo700: "#445e85",

  // Secondary accent, guard
  clay100: "#f6e3da",
  clay200: "#e8c0ae",
  clay300: "#d39b84", // art: clay
  clay500: "#b06e53",
  clay700: "#7d4631",

  // Coins, shields, legendary
  ochre100: "#f4e7bc",
  ochre200: "#f2d99b", // art: ochre
  ochre300: "#e2bd6d",
  ochre500: "#b98f3c",
  ochre700: "#806124",

  // Wood, leather, map
  leather100: "#f0dcc2",
  leather200: "#e1bc8b", // art: leather-light
  leather300: "#bd8b69", // art: leather
  leather500: "#9a6a47",
  leather700: "#6b4830",

  // Gems, epic
  plum100: "#e8dff1",
  plum200: "#cfc0e0",
  plum300: "#b79fcb",
  plum500: "#8f74a8",
  plum700: "#6b4f80",

  // Damage, destructive, failure
  berry100: "#f7ded9",
  berry200: "#eab5aa",
  berry300: "#dd8a78",
  berry500: "#c25947",
  berry700: "#8e3529",
});
