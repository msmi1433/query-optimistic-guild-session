import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getItem, patchItem, type Item } from "./api";

const itemQueryKey = (id: string) => ["item", id];

export const useCheckboxValue = (id: string) =>
  useQuery({ queryKey: itemQueryKey(id), queryFn: () => getItem(id) });

// API call > invalidate > UI updates once the refetch resolves.
export const usePatchCheckboxValue = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: itemQueryKey(id) });
    },
  });
};

// "Via the cache": write the expected value into the cache before the PATCH
// resolves, roll back on failure, then invalidate to sync with the server.
export const useOptimisticPatchCheckboxValue = (id: string) => {
  const queryClient = useQueryClient();
  const queryKey = itemQueryKey(id);

  return useMutation({
    mutationFn: patchItem,
    onMutate: async (payload) => {
      // Stop in-flight refetches overwriting the optimistic value.
      await queryClient.cancelQueries({ queryKey });

      const previous = queryClient.getQueryData<Item>(queryKey);

      queryClient.setQueryData<Item>(queryKey, (prevValue) =>
        prevValue ? { ...prevValue, checked: payload.checked } : prevValue,
      );

      return { previous };
    },
    onError: (_error, _payload, context) => {
      queryClient.setQueryData(queryKey, context?.previous);
    },
    // Runs on success and failure so the cache always ends up matching the server.
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
