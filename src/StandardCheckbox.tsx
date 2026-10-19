import { useCheckboxValue, usePatchCheckboxValue } from "./useCheckboxValue";

const ID = "standard";

export const StandardCheckbox = () => {
  const { data, isLoading, isFetching } = useCheckboxValue(ID);
  const mutation = usePatchCheckboxValue(ID);

  return (
    <section className="demo">
      <div className="demo-text">
        <h2>Not optimistic</h2>
        <p>
          PATCH, then invalidate. The checkbox flips only when the refetch
          resolves.
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
