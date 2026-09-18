import type { Meta, StoryObj } from "@storybook/react-vite";
import * as stylex from "@stylexjs/stylex";
import { CoursePath, type MapPage } from "./course-path.tsx";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { MapTerrain } from "../game/art/map-terrain.tsx";
const page: MapPage = {
  courseId: "english-basics",
  width: 400,
  height: 464,
  nextCursor: null,
  unit: {
    map: { width: 400, height: 900 },
    id: "greetings",
    sceneId: "forest-clearing",
    order: 0,
    title: "Greetings",
    description: "",
    status: "in_progress",
    available: true,
    reason: null,
    completedItems: 1,
    totalItems: 3,
  },
  nodes: [
    {
      id: "hello",
      unitId: "greetings",
      sceneId: "forest-clearing",
      order: 0,
      title: "Hello!",
      description: "",
      kind: "lesson",
      completed: true,
      available: true,
      reason: null,
      encounter: null,
      position: { x: 120, y: 80 },
    },
    {
      id: "practice",
      unitId: "greetings",
      sceneId: "forest-clearing",
      order: 1,
      title: "Greeting practice",
      description: "",
      kind: "practice",
      role: "standard",
      completed: false,
      available: true,
      reason: null,
      encounter: { itemId: "practice", kind: "normal", difficulty: "easy" },
      activeSessionId: null,
      position: { x: 280, y: 232 },
    },
    {
      id: "review",
      unitId: "greetings",
      sceneId: "forest-clearing",
      order: 2,
      title: "Greetings review",
      description: "",
      kind: "practice",
      role: "unit_review",
      completed: false,
      available: false,
      reason: "previous_item_incomplete",
      encounter: { itemId: "review", kind: "boss", difficulty: "medium" },
      activeSessionId: null,
      position: { x: 150, y: 384 },
    },
  ],
  segments: [
    {
      fromItemId: "hello",
      toItemId: "practice",
      start: { x: 120, y: 80 },
      control1: { x: 120, y: 156 },
      control2: { x: 280, y: 156 },
      end: { x: 280, y: 232 },
    },
    {
      fromItemId: "practice",
      toItemId: "review",
      start: { x: 280, y: 232 },
      control1: { x: 280, y: 308 },
      control2: { x: 150, y: 308 },
      end: { x: 150, y: 384 },
    },
  ],
};
const styles = stylex.create({ frame: { maxInlineSize: layout.portrait } });
const savedBattlePage: MapPage = {
  ...page,
  nodes: page.nodes.map((node) =>
    node.id === "practice" ? { ...node, completed: true, activeSessionId: "session-1" } : node,
  ),
};
const meta = {
  title: "Realm/Course path",
  component: CoursePath,
  tags: ["autodocs"],
  args: { page, onSelect: () => undefined },
  argTypes: { page: { control: "object" } },
  decorators: [
    (Story, context) => (
      <div {...stylex.props(styles.frame)}>
        <MapTerrain sceneId={context.args.page.unit.sceneId}>
          <Story />
        </MapTerrain>
      </div>
    ),
  ],
} satisfies Meta<typeof CoursePath>;
export default meta;
type Story = StoryObj<typeof meta>;
export const InProgress: Story = {};
export const SavedBattle: Story = {
  args: { page: savedBattlePage },
};
