import {
  cosmetics,
  enemies,
  equipments,
  icons,
  regions,
  skills,
  type CombatIconMetadata,
  type CosmeticMetadata,
  type EnemyMetadata,
  type EquipmentMetadata,
  type ItemMetadata,
} from "@edurune/art/catalog";

export const cosmeticMetadata = new Map<string, CosmeticMetadata>(
  cosmetics.map((item) => [item.id, item]),
);
export const enemyMetadata = new Map<string, EnemyMetadata>(enemies.map((item) => [item.id, item]));
export const equipmentMetadata = new Map<string, EquipmentMetadata>(
  equipments.map((item) => [item.id, item]),
);
export const iconMetadata = new Map<string, CombatIconMetadata>(
  icons.map((item) => [item.id, item]),
);
export const regionMetadata = new Map<string, ItemMetadata>(regions.map((item) => [item.id, item]));
export const skillMetadata = new Map<string, ItemMetadata>(skills.map((item) => [item.id, item]));
