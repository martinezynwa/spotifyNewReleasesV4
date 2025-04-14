import { useMutation } from '@tanstack/react-query'

import { handleFetch } from '../fetch'

export const useManualFetch = (dayLimit: number) => {
  return useMutation({
    mutationFn: () =>
      handleFetch('/releases/manual-fetch', {
        method: 'POST',
        body: JSON.stringify({
          dayLimit,
        }),
      }),
    onSuccess: (response) => {
      console.log('response', response)
    },
  })
}
