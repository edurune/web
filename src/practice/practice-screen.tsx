import { useEffect, useRef, useState } from "react";
import { Trans, useLingui } from "@lingui/react/macro";
import { CaretLeftIcon, CaretRightIcon, InfoIcon } from "@phosphor-icons/react";
import { useNavigate } from "@tanstack/react-router";
import * as stylex from "@stylexjs/stylex";
import { useSessionQuery, type SessionPath } from "../api/session/use-session-queries.ts";
import {
  useAbandonSessionMutation,
  useRetrySessionMutation,
  useSelectActionMutation,
  useSubmitAnswerMutation,
} from "../api/session/use-session-mutations.ts";
import { useCharacterQuery } from "../api/character/use-character-queries.ts";
import { errorMessage } from "../api/error-messages.ts";
import { Button, IconButton } from "../ui/primitives/button.tsx";
import { Alert } from "../ui/primitives/alert.tsx";
import { Dialog } from "../ui/primitives/dialog.tsx";
import { MenuItem } from "../ui/primitives/menu.tsx";
import { ScrollArea } from "../ui/primitives/scroll-area.tsx";
import { Spinner } from "../ui/primitives/spinner.tsx";
import { Stack } from "../ui/primitives/stack.tsx";
import { Text } from "../ui/primitives/text.tsx";
import { VisuallyHidden } from "../ui/primitives/visually-hidden.tsx";
import { useMusic } from "../ui/sound/use-music.ts";
import { useSoundLoop } from "../ui/sound/use-sound-loop.ts";
import { useSoundWhen } from "../ui/sound/use-sound-when.ts";
import { color } from "../ui/tokens/color.stylex.ts";
import { space } from "../ui/tokens/space.stylex.ts";
import { layout } from "../ui/tokens/layout.stylex.ts";
import { duration, easing } from "../ui/tokens/motion.stylex.ts";
import { layer } from "../ui/tokens/layer.stylex.ts";
import { practiceLayout } from "../ui/tokens/practice.stylex.ts";
import { iconSize } from "../ui/tokens/scale.ts";
import { realmStyles } from "../realm/realm-layout.ts";
import { AnswerInput } from "./answer-input.tsx";
import { encounterTrack } from "./encounter-music.ts";
import { PracticeArena } from "./practice-arena.tsx";
import { PlayerResources } from "./player-resources.tsx";
import { MovePicker } from "./move-picker.tsx";
import type { BattlePresentation } from "../game/art/session-battle.tsx";
import { PracticeInfoSheet } from "./practice-info-sheet.tsx";
import { PracticeResult } from "./practice-result.tsx";
import {
  actionKey,
  answerReady,
  type ActionOption,
  type Answer,
  type AnswerPhase,
} from "./session.ts";
import { SettingsMenu } from "../user/settings-menu.tsx";

const revealResult = stylex.keyframes({
  from: { transform: "translateY(100%)" },
  to: { transform: "translateY(0)" },
});
const styles = stylex.create({
  page: {
    position: "relative",
    overflow: "hidden",
    containerType: "inline-size",
    backgroundColor: color.surfacePage,
  },
  result: {
    position: "absolute",
    inset: space.none,
    zIndex: layer.raised,
    display: "flex",
    flexDirection: "column",
    backgroundColor: color.surfacePage,
    animationName: revealResult,
    animationDuration: duration.deliberate,
    animationTimingFunction: easing.entrance,
    "@media (prefers-reduced-motion: reduce)": { animationName: "none" },
  },
  resultContent: { paddingBlockStart: space.xxl },
  chrome: {
    position: "absolute",
    insetBlockStart: space.md,
    insetInline: space.md,
    zIndex: layer.raised,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: space.sm,
    pointerEvents: "none",
  },
  control: { pointerEvents: "auto" },
  footer: {
    display: "flex",
    flexDirection: "column",
    gap: space.md,
    flexShrink: 0,
    padding: space.lg,
    paddingBlockEnd: `max(${space.lg}, ${layout.safeBottom})`,
    backgroundColor: color.surfacePage,
  },
  resources: { padding: space.md, backgroundColor: color.surfaceRaised, flexShrink: 0 },
  buttons: { display: "flex", gap: space.sm },
  loading: { display: "flex", justifyContent: "center", padding: space.xl },
  scene: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
    minBlockSize: space.none,
    overflow: "hidden",
  },
  arena: {
    flex: "0 0 auto",
    aspectRatio: practiceLayout.arenaRatio,
    maxBlockSize: practiceLayout.compactArena,
  },
  task: {
    display: "flex",
    flexDirection: "column",
    flex: "1 1 0",
    minBlockSize: space.none,
    overflow: "hidden",
  },
});

export function PracticeScreen({ path }: { path: SessionPath }) {
  const { t } = useLingui();
  const navigate = useNavigate();
  const query = useSessionQuery(path);
  const character = useCharacterQuery();
  const select = useSelectActionMutation(path);
  const submit = useSubmitAnswerMutation(path);
  const abandon = useAbandonSessionMutation(path);
  const retry = useRetrySessionMutation(path);
  const viewport = useRef<HTMLDivElement>(null);
  const resultPanel = useRef<HTMLElement>(null);
  const [target, setTarget] = useState<{
    revision: number;
    id: string;
  } | null>(null);
  const [draft, setDraft] = useState<{ revision: number; answer: Answer } | null>(null);
  const [submitted, setSubmitted] = useState<{
    revision: number;
    phase: AnswerPhase;
    answer: Answer;
  } | null>(null);
  const [playing, setPlaying] = useState(false);
  const [playedRevision, setPlayedRevision] = useState(0);
  const [presentation, setPresentation] = useState<BattlePresentation | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const result = query.data;
  const session = result?.session;
  const phase = session?.phase;
  const unit = result?.course.units.find((entry) =>
    entry.items.some((item) => item.id === path.itemId),
  );
  const item = unit?.items.find((entry) => entry.id === path.itemId);
  const busy = select.isPending || submit.isPending || abandon.isPending || retry.isPending;
  const error =
    select.error ?? submit.error ?? abandon.error ?? retry.error ?? query.error ?? character.error;
  const evaluation =
    submit.isSuccess &&
    submitted &&
    session &&
    session.feedback.revision > submitted.revision &&
    session.feedback.evaluation?.questionId === submitted.phase.question.id
      ? session.feedback.evaluation
      : null;
  const heldAnswer =
    submitted &&
    (submit.isPending ||
      (evaluation && session && character.data && playedRevision < session.feedback.revision))
      ? submitted
      : null;
  const answerPhase = heldAnswer?.phase ?? (phase?.kind === "awaiting_answer" ? phase : null);
  const answerRevision = heldAnswer?.revision ?? session?.revision ?? 0;
  const answer = heldAnswer?.answer ?? (draft?.revision === answerRevision ? draft.answer : null);
  const actions = phase?.kind === "awaiting_action" ? phase.actions : [];
  const player = session?.combatants.find((actor) => actor.id === session.playerId);
  const targetIds = [
    ...new Set(
      actions
        .filter((option) => option.available && option.targeting === "single_enemy")
        .flatMap((option) => option.targetIds),
    ),
  ];
  const targetId =
    target && target.revision === session?.revision && targetIds.includes(target.id)
      ? target.id
      : (targetIds[0] ?? null);
  const selectedIds = answerPhase
    ? answerPhase.selection.targetId
      ? [answerPhase.selection.targetId]
      : []
    : targetId
      ? [targetId]
      : [];
  const finished = phase?.kind === "finished" && !heldAnswer;
  const wave = presentation?.wave ?? session?.wave.number;
  const total = session?.wave.total;
  const turn = session?.turn;
  useSoundLoop("loading", !session && !error);
  useMusic(session && wave && !finished ? encounterTrack(session, wave) : null, "scene");
  useSoundWhen("error", evaluation?.correct === false);

  useEffect(() => {
    // Each stage starts at its own top; selection changes keep the current scroll position.
    viewport.current?.scrollTo({ top: 0 });
    // eslint-disable-next-line react/exhaustive-effect-dependencies
  }, [phase?.kind, answerPhase?.question.id, finished]);
  useEffect(() => {
    if (finished) resultPanel.current?.focus({ preventScroll: true });
  }, [finished]);

  const back = () =>
    void navigate({
      to: "/courses/$courseId",
      params: { courseId: path.courseId },
      search: { unit: unit?.id },
    });
  const refresh = () => {
    select.reset();
    submit.reset();
    abandon.reset();
    retry.reset();
    void query.refetch();
    void character.refetch();
  };
  const confirmAnswer = () => {
    if (
      !session ||
      !answer ||
      phase?.kind !== "awaiting_answer" ||
      busy ||
      playing ||
      heldAnswer ||
      !answerReady(phase.question, answer)
    )
      return;
    select.reset();
    setSubmitted({ revision: session.revision, phase, answer });
    submit.mutate({
      path,
      body: { revision: session.revision, submission: { questionId: phase.question.id, answer } },
    });
  };
  const chooseAction = (option: ActionOption) => {
    if (!session || phase?.kind !== "awaiting_action" || busy || playing || heldAnswer) return;
    const available = phase.actions.find(
      (entry) => entry.available && actionKey(entry.action) === actionKey(option.action),
    );
    if (!available) return;
    const actionTarget =
      available.targeting === "single_enemy"
        ? targetId && available.targetIds.includes(targetId)
          ? targetId
          : (available.targetIds[0] ?? null)
        : null;
    if (available.targeting === "single_enemy" && !actionTarget) return;
    submit.reset();
    setSubmitted(null);
    setDraft(null);
    select.mutate({
      path,
      body: {
        revision: session.revision,
        selection: { action: available.action, targetId: actionTarget },
      },
    });
  };
  return (
    <main {...stylex.props(realmStyles.page, styles.page)}>
      <div inert={finished} aria-hidden={finished || undefined} {...stylex.props(realmStyles.page)}>
        <VisuallyHidden>
          <h1>{item?.title ?? t`Practice`}</h1>
        </VisuallyHidden>
        <section {...stylex.props(styles.scene)}>
          <div {...stylex.props(styles.chrome)}>
            <IconButton
              icon={CaretLeftIcon}
              label={t`Back to map`}
              variant="secondary"
              cue="back"
              disabled={busy}
              style={styles.control}
              onClick={() => (finished || !session ? back() : setLeaving(true))}
            />
            <SettingsMenu variant="secondary" style={styles.control}>
              {result && session && (
                <MenuItem onClick={() => setInfoOpen(true)}>
                  <InfoIcon size={iconSize.sm} weight="bold" aria-hidden="true" />
                  <Trans>Practice info</Trans>
                </MenuItem>
              )}
            </SettingsMenu>
          </div>
          {session && character.data && (
            <PracticeArena
              style={styles.arena}
              sessionId={path.sessionId}
              session={session}
              character={character.data}
              targetIds={!busy && !playing && !answerPhase ? targetIds : []}
              selectedIds={selectedIds}
              selection={answerPhase?.selection}
              playing={playing}
              onPlaybackChange={(active, revision) => {
                setPlaying(active);
                if (!active) setPlayedRevision((before) => Math.max(before, revision));
              }}
              onPresentationChange={setPresentation}
              onTarget={
                !busy && !playing && !answerPhase && phase?.kind === "awaiting_action"
                  ? (id) => setTarget({ revision: session.revision, id })
                  : undefined
              }
            />
          )}
          {session && (
            <PlayerResources
              session={presentation ? { ...session, combatants: presentation.combatants } : session}
              character={character.data}
              style={styles.resources}
            />
          )}
        </section>
        <section {...stylex.props(styles.task)}>
          <ScrollArea
            key={answerPhase ? answerPhase.question.id : `action-${session?.revision ?? 0}`}
            viewportRef={viewport}
            indicator="fade"
            hint={t`More below`}
            style={realmStyles.scroll}
            contentStyle={realmStyles.content}
            label={answerPhase ? t`Question` : t`Practice`}
          >
            {error && (
              <Alert
                tone="negative"
                action={
                  <Button
                    variant="secondary"
                    size="sm"
                    cue="retry"
                    onClick={refresh}
                    disabled={busy}
                  >
                    <Trans>Try again</Trans>
                  </Button>
                }
              >
                {t(errorMessage(error))}
              </Alert>
            )}
            {!session && !error && (
              <div {...stylex.props(styles.loading)}>
                <Spinner label={t`Loading practice`} />
              </div>
            )}
            {session && answerPhase && (
              <>
                <form
                  id="practice-answer"
                  onSubmit={(event) => {
                    event.preventDefault();
                    confirmAnswer();
                  }}
                >
                  <AnswerInput
                    key={answerRevision}
                    question={answerPhase.question}
                    answer={answer}
                    disabled={busy || Boolean(heldAnswer)}
                    {...(heldAnswer && evaluation && { correct: evaluation.correct })}
                    onChange={(value) =>
                      setDraft(value === null ? null : { revision: answerRevision, answer: value })
                    }
                  />
                </form>
              </>
            )}
            {session && phase?.kind === "awaiting_action" && !heldAnswer && (
              <MovePicker
                key={session.revision}
                actions={actions}
                skills={player?.skills ?? []}
                pendingAction={
                  select.isPending && select.variables
                    ? actionKey(select.variables.body.selection.action)
                    : undefined
                }
                disabled={busy || playing}
                onAction={chooseAction}
              />
            )}
          </ScrollArea>
          {answerPhase && (
            <footer {...stylex.props(styles.footer)}>
              {session && (
                <Button
                  size="lg"
                  fullWidth
                  cue="send"
                  type="submit"
                  form="practice-answer"
                  loading={submit.isPending || playing}
                  disabled={busy || playing || !answerReady(answerPhase.question, answer)}
                >
                  <Trans>Confirm answer</Trans>
                </Button>
              )}
            </footer>
          )}
          {session && !answerPhase && phase?.kind === "awaiting_action" && (
            <footer {...stylex.props(styles.footer)}>
              <Text variant="caption" tone="secondary" align="center">
                <Trans>
                  Wave {wave}/{total} · Turn {turn}
                </Trans>
              </Text>
            </footer>
          )}
        </section>
      </div>
      {finished && result && session && (
        <section
          ref={resultPanel}
          tabIndex={-1}
          aria-label={t`Practice results`}
          {...stylex.props(styles.result)}
        >
          <ScrollArea
            indicator="fade"
            style={realmStyles.scroll}
            contentStyle={[realmStyles.content, styles.resultContent]}
            label={t`Practice results`}
          >
            {error && <Alert tone="negative">{t(errorMessage(error))}</Alert>}
            <PracticeResult result={result} />
          </ScrollArea>
          <footer {...stylex.props(styles.footer)}>
            {session.phase.kind === "finished" && session.phase.outcome === "won" ? (
              <Button size="lg" fullWidth cue="forward" iconEnd={CaretRightIcon} onClick={back}>
                <Trans>Continue</Trans>
              </Button>
            ) : (
              <div {...stylex.props(styles.buttons)}>
                <Button
                  variant="secondary"
                  cue="back"
                  style={realmStyles.grow}
                  disabled={busy}
                  onClick={back}
                >
                  <Trans>Map</Trans>
                </Button>
                <Button
                  cue="retry"
                  style={realmStyles.grow}
                  loading={retry.isPending}
                  disabled={busy}
                  onClick={() =>
                    retry.mutate(
                      { path, body: { revision: session.revision } },
                      {
                        onSuccess: (next) =>
                          void navigate({
                            to: "/courses/$courseId/practices/$itemId/sessions/$sessionId",
                            params: { ...path, sessionId: next.id },
                            replace: true,
                          }),
                      },
                    )
                  }
                >
                  <Trans>Try again</Trans>
                </Button>
              </div>
            )}
          </footer>
        </section>
      )}
      {result && session && (
        <PracticeInfoSheet
          open={infoOpen}
          onOpenChange={setInfoOpen}
          courseTitle={result.course.title}
          unitTitle={unit?.title}
          itemTitle={item?.title}
          description={item?.description}
          difficulty={session.encounter.difficulty}
        />
      )}
      <Dialog
        open={leaving}
        onOpenChange={setLeaving}
        dismissible={!busy}
        title={t`Leave practice?`}
        description={t`Your battle is saved. Come back whenever you’re ready.`}
        footer={
          <Button
            fullWidth
            variant="secondary"
            cue="cancel"
            disabled={busy}
            onClick={() => setLeaving(false)}
          >
            <Trans>Keep playing</Trans>
          </Button>
        }
      >
        <Stack gap="md">
          {abandon.error && <Alert tone="negative">{t(errorMessage(abandon.error))}</Alert>}
          <Button fullWidth cue="checkpoint" disabled={busy} onClick={back}>
            <Trans>Save and leave</Trans>
          </Button>
          <Button
            fullWidth
            variant="danger"
            cue="stop"
            loading={abandon.isPending}
            disabled={busy || !session}
            onClick={() =>
              session &&
              abandon.mutate(
                { path, body: { revision: session.revision } },
                {
                  onSuccess: () => {
                    setLeaving(false);
                    setSubmitted(null);
                  },
                },
              )
            }
          >
            <Trans>End run</Trans>
          </Button>
        </Stack>
      </Dialog>
    </main>
  );
}
