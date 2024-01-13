import { useEffect, useRef, useState } from "react";
import "./App.css";

import Playground from "./features/Playground";

interface CustomWindow extends Window {
  phiWorker: Worker | null;
}

declare let window: CustomWindow;

window.phiWorker = null;

function App() {
  const [phiWorker, setPhiWorker] = useState<Worker | null>(null);
  const phiWorkerRef = useRef<Worker>();

  useEffect(() => {
    const phiWorker = new Worker(
      new URL("./models/phi/worker.js", import.meta.url),
      { type: "module" }
    );

    phiWorker.onmessage = (event: MessageEvent<number>) => {
      console.log(`phiWorker Response =>`, event.data);
    };

    phiWorkerRef.current = phiWorker;
    setPhiWorker(phiWorker);
  }, []);

  return (
    <>
      <Playground phiWorker={phiWorker} />
    </>
  );
}

export default App;
