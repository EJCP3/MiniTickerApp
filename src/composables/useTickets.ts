import { useMutation, useQueryCache } from '@pinia/colada'
import ticketService from '@/services/ticketService'

export function useTicketActions() {
  const queryCache = useQueryCache()

  const { mutateAsync: createTicket, isLoading: isSubmitting } = useMutation({
    mutation: (payload: FormData) => ticketService.create(payload),
    // Al tener éxito, invalidamos la lista de tickets para que se refresque
    onSuccess: () => {
      queryCache.invalidateQueries({ key: ['tickets'] })
    },
  })

  return {
    createTicket,
    isSubmitting
  }
}