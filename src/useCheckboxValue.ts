import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getItem, patchItem, type CheckboxItem } from "./api";

const itemQueryKey = (id: string) => ["item", id];

export const useCheckboxValue = (id: string) =>
  useQuery({ queryKey: itemQueryKey(id), queryFn: () => getItem(id) });

// API call > invalidate > UI updates once the refetch resolves.
export const usePatchCheckboxValue = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchItem,
    onSuccess: () => {
      // Invalidate the query to ensure the UI is updated with the latest server state following mutation
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

      // Snapshot the previous value before optimistically updating.
      const previous = queryClient.getQueryData<CheckboxItem>(queryKey);

      // Optimistically update to the new value, causing re-render and UI update
      queryClient.setQueryData<CheckboxItem>(queryKey, (prevValue) =>
        prevValue ? { ...prevValue, checked: payload.checked } : prevValue,
      );

      // Return the snapshot as context so it can be used in onError to roll back.
      return { previous };
    },
    onError: (_error, _payload, context) => {
      // Roll back to the previous value if the PATCH/mutation fails.
      queryClient.setQueryData(queryKey, context?.previous);
    },
    onSettled: () => {
      // Runs on success and failure so the cache always ends up matching the server.
      void queryClient.invalidateQueries({ queryKey });
    },
  });
};
