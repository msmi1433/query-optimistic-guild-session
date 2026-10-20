// In-memory stand-in for a real API so the demo needs no server.
// Every call is delayed so the difference between optimistic and
// non-optimistic rendering is easy to see.

export type CheckboxItem = { id: string; checked: boolean };

const LATENCY_MS = 1500;

const db = new Map<string, CheckboxItem>([
  ["standard", { id: "standard", checked: false }],
  ["optimistic", { id: "optimistic", checked: false }],
  ["via-ui", { id: "via-ui", checked: false }],
]);

let shouldFailPatch = false;

export const setShouldFailPatch = (value: boolean) => {
  shouldFailPatch = value;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// GET /items/:id
export const getItem = async (id: string): Promise<CheckboxItem> => {
  await sleep(LATENCY_MS);
  const item = db.get(id);
  if (!item) throw new Error(`Item ${id} not found`);
  return { ...item };
};

// PATCH /items/:id  { checked }
export const patchItem = async (payload: CheckboxItem): Promise<void> => {
  await sleep(LATENCY_MS);
  if (shouldFailPatch) throw new Error("FAILED");
  if (!db.has(payload.id)) throw new Error(`Item ${payload.id} not found`);
  db.set(payload.id, { id: payload.id, checked: payload.checked });
};
