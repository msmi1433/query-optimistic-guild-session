import {
  useCheckboxValue,
  useOptimisticPatchCheckboxValue,
} from "./useCheckboxValue";

const ID = "optimistic";

export const OptimisticCheckbox = () => {
  const { data, isLoading, isFetching } = useCheckboxValue(ID);
  const mutation = useOptimisticPatchCheckboxValue(ID);

  return (
    <section className="demo">
      <div className="demo-text">
        <h2>Optimistic (via the cache)</h2>
        <p>
          setQueryData in onMutate. The checkbox flips instantly, then the
          refetch confirms it.
        </p>
      </div>
      <label>
        <input
          type="checkbox"
          checked={data?.checked ?? false}
          disabled={isLoading}
          onChange={(event) =>
            mutation.mutate({ id: ID, checked: event.target.checked })
          }
        />
        Checked
      </label>
      <div className="demo-feedback">
        <ol className="status">
          <li className={mutation.isPending ? "in-flight" : undefined}>
            PATCH
            {mutation.isPending && (
              <span className="spinner" role="status" aria-label="In flight" />
            )}
            {mutation.isError && (
              <span className="error"> - {mutation.error.message}</span>
            )}
          </li>
          <li className={isFetching ? "in-flight" : undefined}>
            Invalidation GET
            {isFetching && (
              <span className="spinner" role="status" aria-label="In flight" />
            )}
          </li>
        </ol>
      </div>
    </section>
  );
};
