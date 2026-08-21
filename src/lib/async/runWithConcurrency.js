// Runs `worker` over `items` with at most `concurrency` in flight at once.
// Every item runs to completion regardless of sibling failures; if any
// worker throws, a single aggregate error (with an `.errors` array) is
// thrown after all items have settled, so a failure never abandons work
// that was already in progress.
export default async function runWithConcurrency(items, concurrency, worker) {
  const queue = [...items]
  const errors = []

  const lanes = Array.from(
    { length: Math.max(1, Math.min(concurrency, queue.length)) },
    async () => {
      while (queue.length) {
        const item = queue.shift()
        try {
          await worker(item)
        } catch (e) {
          console.error(e)
          errors.push(e)
        }
      }
    }
  )

  await Promise.all(lanes)

  if (errors.length) {
    const error = new Error(`[notifiles] ${errors.length} of ${items.length} item(s) failed`)
    error.errors = errors
    throw error
  }
}
