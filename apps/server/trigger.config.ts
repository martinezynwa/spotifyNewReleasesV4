import { defineConfig } from '@trigger.dev/sdk/v3'

export default defineConfig({
  project: 'proj_pcjlqjuulmnxoqylxazp',
  runtime: 'node',
  logLevel: 'log',
  maxDuration: 10, // 10 seconds
  retries: {
    enabledInDev: true,
    default: {
      maxAttempts: 0,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 10000,
      factor: 2,
      randomize: true,
    },
  },
  dirs: ['./src/trigger'],
})
