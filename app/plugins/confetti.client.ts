import JSConfetti from 'js-confetti'

import type { ConfettiVariant } from '~/types'

export default defineNuxtPlugin((_) => {
  const confettiApi = new JSConfetti()

  const confettiBacklog = ref<ConfettiVariant[]>([])

  const dispatchConfetti = (variant: ConfettiVariant): void => {
    if (variant == 'dino') {
      confettiApi.addConfetti({
        confettiNumber: 100,
      })
      confettiApi.addConfetti({
        emojis: ['🦖', '🦕', '🌴'],
        confettiNumber: 20,
      })
    } else
      confettiApi.addConfetti()
  }

  const addConfetti = (variant: ConfettiVariant): void => {
    confettiBacklog.value.push(variant)
  }

  const clearConfetti = () => confettiApi.clearCanvas()

  effect(() => {
    while (confettiBacklog.value.length > 0) {
      addConfetti(confettiBacklog.value.shift()!)
    }
  }, { allowRecurse: false })

  onUnmounted(() => {
    if (confettiApi)
      confettiApi.destroyCanvas()
  })

  return {
    provide: {
      confetti: { dispatch: dispatchConfetti, clear: clearConfetti },
    },
  }
})
