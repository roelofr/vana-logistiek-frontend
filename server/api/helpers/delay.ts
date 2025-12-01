export const randomDelay = (data: unknown, delay: number): Promise<unknown> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay + ((delay * 0.1) - Math.random() * delay * 0.20))
  })
}
