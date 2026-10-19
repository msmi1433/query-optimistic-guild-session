import { useMutation, useQueryClient } from "@tanstack/react-query";

import { patchItem } from "./api";

// "Via the UI": the cache is never touched. The component renders
// `mutation.variables.checked` while `mutation.isPending`, and falls back to
// the cached value (from useCheckboxValue) once the mutation settles.
export const usePatchCheckboxValueViaUi = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["item", id] }),
  });
};
