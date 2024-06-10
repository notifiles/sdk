
test.skip('creates a new template', async () => {
  const fsPath = (await import('path')).default
  let path = `${fsPath.resolve(process.env.TEST_MOCK_FOLDER)}`
  const operation = (await import('./index.js')).default

  const result = await operation({
    path,
    title: "Sample template",
    force: true
  })

  expect(result).toBeTruthy()
})


