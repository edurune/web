import type { Meta, StoryObj } from "@storybook/react-vite";
import { Checkbox } from "./checkbox.tsx";
import { Field } from "./field.tsx";
import { RadioGroup, RadioOption } from "./radio-group.tsx";
import { Segment, SegmentedControl } from "./segmented-control.tsx";
import { Select } from "./select.tsx";
import { Stack } from "./stack.tsx";
import { Switch } from "./switch.tsx";
import { TextArea, TextField } from "./text-field.tsx";
import { Text } from "./text.tsx";

const meta = {
  title: "Primitives/Form",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const courses = [
  { value: "spanish", label: "Spanish basics" },
  { value: "python", label: "Intro to Python" },
  { value: "algebra", label: "Algebra I" },
];

export const TextInputs: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="lg">
        <Field label="Display name" description="Shown to other learners.">
          <TextField placeholder="Ada" maxLength={24} />
        </Field>
        <Field label="Answer" error="That is not quite right.">
          <TextField defaultValue="Buenos dias" invalid />
        </Field>
        <Field label="Notes">
          <TextArea placeholder="What did you find hard?" rows={3} />
        </Field>
        <Field label="Locked" disabled>
          <TextField defaultValue="Cannot edit" disabled />
        </Field>
      </Stack>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="md">
        <TextField placeholder="Small" size="sm" />
        <TextField placeholder="Medium" size="md" />
        <TextField placeholder="Large" size="lg" />
      </Stack>
    </div>
  ),
};

export const Choices: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="xl">
        <Stack gap="sm">
          <Text variant="overline" tone="muted">
            checkbox
          </Text>
          <Checkbox defaultChecked>Remind me daily</Checkbox>
          <Checkbox>Play battle sounds</Checkbox>
          <Checkbox indeterminate>Some units selected</Checkbox>
          <Checkbox disabled>Unavailable</Checkbox>
        </Stack>

        <Stack gap="sm">
          <Text variant="overline" tone="muted">
            radio
          </Text>
          <RadioGroup defaultValue="medium">
            <RadioOption value="easy">Easy</RadioOption>
            <RadioOption value="medium">Medium</RadioOption>
            <RadioOption value="hard">Hard</RadioOption>
          </RadioGroup>
        </Stack>

        <Stack gap="sm">
          <Text variant="overline" tone="muted">
            switch
          </Text>
          <Switch defaultChecked>Reduced motion</Switch>
          <Switch>Sound effects</Switch>
          <Switch disabled>Notifications</Switch>
        </Stack>
      </Stack>
    </div>
  ),
};

export const Selects: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Stack gap="lg">
        <Field label="Course">
          <Select options={courses} defaultValue="spanish" />
        </Field>
        <Field label="Unavailable" disabled>
          <Select options={courses} placeholder="Pick a course" disabled />
        </Field>
      </Stack>
    </div>
  ),
};

export const Segments: Story = {
  render: () => (
    <Stack gap="md" align="start">
      <SegmentedControl defaultValue={["equipment"]}>
        <Segment value="equipment">Equipment</Segment>
        <Segment value="cosmetics">Cosmetics</Segment>
      </SegmentedControl>
      <SegmentedControl defaultValue={["all"]}>
        <Segment value="all">All</Segment>
        <Segment value="owned">Owned</Segment>
        <Segment value="affordable">Affordable</Segment>
      </SegmentedControl>
    </Stack>
  ),
};
