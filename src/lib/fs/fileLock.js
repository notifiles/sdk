// Serializes concurrent reads/writes to the same file path so a read can
// never observe a write mid-truncate (e.g. multiple locale versions of a
// template racing on the same .activity.json during a parallel sync).
const queues = new Map()

export default function withFileLock(key, fn) {
  const previous = queues.get(key) || Promise.resolve()
  const run = previous.catch(() => {}).then(fn)
  queues.set(key, run.catch(() => {}))
  return run
}
