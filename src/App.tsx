import { useState } from "react";

import { setShouldFailPatch } from "./api";
import { OptimisticCheckbox } from "./OptimisticCheckbox";
import { StandardCheckbox } from "./StandardCheckbox";
import { ViaUiCheckbox } from "./ViaUiCheckbox";
import "./App.css";

function App() {
  const [shouldFail, setShouldFail] = useState(false);

  return (
    <main>
      <h1>Optimistic rendering with Tanstack Query</h1>
      <label>
        <input
          type="checkbox"
          checked={shouldFail}
          onChange={(event) => {
            setShouldFail(event.target.checked);
            setShouldFailPatch(event.target.checked);
          }}
        />
        Make every PATCH fail (shows the rollback)
      </label>
      <div className="demos">
        <StandardCheckbox />
        <OptimisticCheckbox />
      </div>
      <details className="bonus">
        <summary>Bonus: the simpler "via the UI" approach</summary>
        <ViaUiCheckbox />
      </details>
    </main>
  );
}

export default App;
