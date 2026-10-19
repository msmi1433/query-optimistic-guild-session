import { useCheckboxValue } from "./useCheckboxValue";
import { usePatchCheckboxValueViaUi } from "./useCheckboxValueViaUi";

const ID = "via-ui";

export const ViaUiCheckbox = () => {
  const { data, isLoading, isFetching } = useCheckboxValue(ID);
  const mutation = usePatchCheckboxValueViaUi(ID);

  // No cache writes: show the in-flight mutation's value while it is pending.
  const checked = mutation.isPending
    ? mutation.variables.checked
    : (data?.checked ?? false);

  return (
    <section className="demo">
      <div className="demo-text">
        <h2>Optimistic (via the UI)</h2>
        <p>
          No cache writes. The checkbox renders the mutation's variables while
          pending, then falls back to the refetched value.
        </p>
      </div>
      <label>
        <input
          type="checkbox"
          checked={checked}
          disabled={isLoading}
          onChange={(event) =>
            mutation.mutate({ id: ID, checked: event.target.checked })
          }
        />
        Checked
      </label>
      <div className="demo-feedback">
        <ol className="status">
          <li
            className={
              mutation.isPending && !isFetching ? "in-flight" : undefined
            }
          >
            PATCH
            {/* Pending also covers the refetch here, so only spin during the PATCH itself. */}
            {mutation.isPending && !isFetching && (
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
