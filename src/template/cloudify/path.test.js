
describe.skip('cloudify', () => {
  it('cloudifies to minio', async () => {
    const fsPath = (await import('path')).default
    let path = fsPath.resolve(process.env.TEST_MOCK_FOLDER)
    const operation = (await import('./path.js')).default

    const result = await operation({
      settings: {
        clouds: [{
          id: "minio",
          auth: {
            endPoint: process.env.MINIO_ENDPOINT,
            accessKey: process.env.MINIO_ACCESS_KEY,
            secretKey: process.env.MINIO_SECRET,
            bucketName: process.env.MINIO_BUCKET_NAME
          }
        }]
      },
      path,
    })
    expect(result).toBeTruthy()
  })
})
