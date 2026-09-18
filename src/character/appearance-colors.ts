import { msg } from "@lingui/core/macro";

// These are saved character data, not interface theme colors.
export const appearanceColors = {
  skinTone: [
    { value: "#f9e4d4", label: msg`Fair` },
    { value: "#f7d9c4", label: msg`Porcelain` },
    { value: "#edc3ad", label: msg`Light rose` },
    { value: "#e6b18a", label: msg`Peach` },
    { value: "#c6a07d", label: msg`Olive` },
    { value: "#c68642", label: msg`Golden` },
    { value: "#b98267", label: msg`Warm tan` },
    { value: "#a06740", label: msg`Bronze` },
    { value: "#895b46", label: msg`Medium brown` },
    { value: "#6f4527", label: msg`Deep brown` },
    { value: "#593d32", label: msg`Cool deep brown` },
    { value: "#452c21", label: msg`Espresso` },
  ],
  hairColor: [
    { value: "#2c1b18", label: msg`Black` },
    { value: "#514543", label: msg`Dark brown` },
    { value: "#6f4527", label: msg`Brown` },
    { value: "#8b6246", label: msg`Chestnut` },
    { value: "#a65e38", label: msg`Auburn` },
    { value: "#b87b51", label: msg`Copper` },
    { value: "#d4ac62", label: msg`Blond` },
    { value: "#f0dfb6", label: msg`Platinum blond` },
    { value: "#a49d94", label: msg`Gray` },
    { value: "#d9d2c6", label: msg`Silver` },
    { value: "#747da7", label: msg`Lavender` },
    { value: "#aa6f83", label: msg`Rose` },
  ],
  eyeColor: [
    { value: "#34251f", label: msg`Dark brown` },
    { value: "#5b3a29", label: msg`Brown` },
    { value: "#303047", label: msg`Charcoal` },
    { value: "#7b6843", label: msg`Hazel` },
    { value: "#956b30", label: msg`Amber` },
    { value: "#4b6b52", label: msg`Green` },
    { value: "#3f5f86", label: msg`Blue` },
    { value: "#64727b", label: msg`Gray` },
  ],
} as const;
