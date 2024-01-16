import { useEffect, useRef, useState } from "react";
import Layout from "./layout";
import Playground from "./features/Playground";

interface CustomWindow extends Window {
  phiWorker: Worker | null;
}

declare let window: CustomWindow;

window.phiWorker = null;

const App = () => {
  const [phiWorker, setPhiWorker] = useState<Worker | null>(null);
  const phiWorkerRef = useRef<Worker>();

  useEffect(() => {
    const phiWorker = new Worker(
      new URL("./models/phi/worker.js", import.meta.url),
      { type: "module" }
    );

    phiWorkerRef.current = phiWorker;
    setPhiWorker(phiWorker);
  }, []);

  return (
    <Layout>
      <Playground phiWorker={phiWorker} />
    </Layout>
  );
}

export default App;
