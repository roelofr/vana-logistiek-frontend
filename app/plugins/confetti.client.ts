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
