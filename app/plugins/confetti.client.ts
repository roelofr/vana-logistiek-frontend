import JSConfetti, {type IAddConfettiConfig} from "js-confetti";

import type {ConfettiVariant} from "~/types";

const confettiTypes: Record<string, IAddConfettiConfig[]> = {
  dino: [
    {confettiNumber: 100},
    {
      emojis: ["🦖", "🦕", "🌴"],
      confettiNumber: 20,
    }
  ],
  gay: [
    {confettiNumer: 200},
    {
      emojis: ["🌈", "🏳️‍🌈", "🦄", "✨", "🍆", "🍑"],
      confettiNumber: 20,
    }
  ],
  normal: [{}]
}

export type ConfettiVariant = Keyof<typeof ConfettiTypes>

export default defineNuxtPlugin((_) => {
  const confettiApi = new JSConfetti();

  const confettiBacklog = ref<ConfettiVariant[]>([]);

  const dispatchConfetti = (variant: ConfettiVariant): void => {
    const confettiType = confettiTypes[variant] ?? confettiTypes.normal

    confettiType.forEach(config => confettiApi.addConfetti(config));
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
    {allowRecurse: false},
  );

  onUnmounted(() => {
    if (confettiApi) confettiApi.destroyCanvas();
  });

  return {
    provide: {
      confetti: {dispatch: dispatchConfetti, clear: clearConfetti},
    },
  };
});
