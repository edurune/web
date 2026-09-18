import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { StyleXStyles } from "@stylexjs/stylex";
import type { GetApiMeResponse } from "../api/generated/types.gen.ts";
import { useCharacterProfileQuery } from "../api/character/use-character-queries.ts";
import { useMeQuery } from "../api/user/use-user-queries.ts";
import { useUpdateUserMutation } from "../api/user/use-user-mutations.ts";
import { AppearanceScreen } from "../character/appearance-screen.tsx";
import { BirthYearStep } from "./birth-year-step.tsx";
import { UserLanguageStep } from "./user-language-step.tsx";

export function OnboardingScreen({ style }: { style?: StyleXStyles }) {
  const user = useMeQuery();
  const profile = useCharacterProfileQuery();
  if (!user.data || !profile.data) return null;
  return (
    <OnboardingFlow
      key={user.data.id}
      initial={user.data}
      appearanceChosen={profile.data.appearanceChosen}
      style={style}
    />
  );
}

function OnboardingFlow({
  initial,
  appearanceChosen,
  style,
}: {
  initial: GetApiMeResponse;
  appearanceChosen: boolean;
  style?: StyleXStyles;
}) {
  const navigate = useNavigate();
  const update = useUpdateUserMutation();
  const [step, setStep] = useState<"language" | "birth-year" | "appearance">(
    initial.birthYear === null ? "language" : "appearance",
  );
  const [language, setLanguage] = useState(initial.language);
  const [birthYear, setBirthYear] = useState(initial.birthYear);
  const totalSteps = appearanceChosen ? 2 : 3;
  const back = (next: typeof step) => {
    update.reset();
    setStep(next);
  };
  if (step === "language")
    return (
      <UserLanguageStep
        value={language}
        onValueChange={(value) => {
          setLanguage(value);
          update.reset();
        }}
        totalSteps={totalSteps}
        pending={update.isPending}
        error={update.error}
        style={style}
        onContinue={() => {
          update.mutate({ language }, { onSuccess: () => setStep("birth-year") });
        }}
      />
    );
  if (step === "birth-year")
    return (
      <BirthYearStep
        value={birthYear}
        onValueChange={(value) => {
          setBirthYear(value);
          update.reset();
        }}
        totalSteps={totalSteps}
        pending={update.isPending}
        error={update.error}
        style={style}
        onBack={() => back("language")}
        onContinue={(year) => {
          update.mutate(
            { birthYear: year },
            {
              onSuccess: () => {
                if (appearanceChosen) void navigate({ to: "/", replace: true });
                else setStep("appearance");
              },
            },
          );
        }}
      />
    );
  return <AppearanceScreen onboarding onBack={() => back("birth-year")} style={style} />;
}
