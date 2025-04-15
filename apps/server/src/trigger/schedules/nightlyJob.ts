import { schedules } from '@trigger.dev/sdk/v3'
import { nightlyJob } from '../../services/job/job.service'

export const nightlyJobTask = schedules.task({
  id: 'nightly-job',
  maxDuration: 6000,
  retry: {
    maxAttempts: 0,
  },
  cron: {
    pattern: '0 4 * * *',
    timezone: 'UTC',
  },
  run: async () => {
    await nightlyJob({})

    return { message: 'Job finished' }
  },
})
