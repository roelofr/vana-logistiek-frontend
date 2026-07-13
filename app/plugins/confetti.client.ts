import JSConfetti from "js-confetti";

type AddConfettiType = Parameters<typeof JSConfetti.prototype.addConfetti>[0];

const confettiTypes: Record<string, AddConfettiType[]> = {
  dino: [
    { confettiNumber: 100 },
    {
      emojis: ["🦖", "🦕", "🌴", "🐸", "🐔"],
      confettiNumber: 20,
    },
  ],
  gay: [
    { confettiNumber: 200 },
    {
      emojis: ["🌈", "🏳️‍🌈", "🦄", "✨", "🍆", "🍑"],
      confettiNumber: 20,
    },
  ],
  done: [
    {
      confettiNumber: 400,
      confettiColors: [
        "#a3e635",
        "#4ade80",
        "#84cc16",
        "#65a30d",
        "#4d7c0f",
        "#15803d",
        "#16a34a",
        "#a21caf",
        "#d946ef",
      ],
    },
    {
      emojis: ["✅", "✅", "✅", "😄", "🥳", "🤠"],
      confettiNumber: 8,
    },
  ],
  sad: [
    {
      confettiNumber: 400,
      confettiColors: [
        "#2563eb",
        "#0284c7",
        "#0891b2",
        "#4f46e5",
        "#164e63",
        "#0c4a6e",
        "#1e3a8a",
        "#312e81",
      ],
    },
    {
      emojis: ["🥲", "🥺", "😭", "😢"],
      confettiNumber: 8,
    },
  ],
  normal: [{}],
};

export type ConfettiVariant = keyof typeof confettiTypes;

export default defineNuxtPlugin((_) => {
  const confettiApi = new JSConfetti();

  const confettiBacklog = ref<ConfettiVariant[]>([]);

  const dispatchConfetti = (variant: ConfettiVariant): void => {
    const confettiType = (confettiTypes[variant] ?? confettiTypes.normal)!;

    confettiType.forEach((config) => confettiApi.addConfetti(config));
  };

  const addConfetti = (variant: ConfettiVariant): void => {
    confettiBacklog.value.push(variant);
  };

  const clearConfetti = () => confettiApi.clearCanvas();

  effect(
    () => {
      while (confettiBacklog.value.length > 0) {
        addConfetti(confettiBacklog.value.shift()!);
      }
    },
    { allowRecurse: false },
  );

  onUnmounted(() => {
    if (confettiApi) confettiApi.destroyCanvas();
  });

  return {
    provide: {
      confetti: { dispatch: dispatchConfetti, clear: clearConfetti },
    },
  };
});
