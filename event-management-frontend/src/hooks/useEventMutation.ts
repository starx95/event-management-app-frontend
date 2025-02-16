import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createEvent } from '../api/api';

export const useEventMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
