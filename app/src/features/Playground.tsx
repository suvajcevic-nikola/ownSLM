type Props = {
  phiWorker: Worker | null;
};

const Playground = ({ phiWorker }: Props) => {
  const prompt = "Hello World";
  const temperature = 0.5;
  const topP = 1.0;
  const repeatPenalty = 1.1;
  const seed = 23;
  const maxSeqLen = 1024;

  const modelID = "phi_2_0_q4k";
  const weightsURL = [
    `https://huggingface.co/radames/phi-2-quantized/resolve/main/model-v2-q4k.gguf_aa.part`,
    `https://huggingface.co/radames/phi-2-quantized/resolve/main/model-v2-q4k.gguf_ab.part`,
    `https://huggingface.co/radames/phi-2-quantized/resolve/main/model-v2-q4k.gguf_ac.part`,
  ];
  const tokenizerURL = `https://huggingface.co/radames/phi-2-quantized/resolve/main/tokenizer.json`;
  const configURL = `https://huggingface.co/radames/phi-2-quantized/resolve/main/config.json`;

  if (!phiWorker) {
    return <div>phiWorker is not ready</div>;
  }

  const handlePrompt = () => {
    phiWorker.postMessage({ command: "abort" });

    phiWorker.postMessage({
      weightsURL,
      modelID,
      tokenizerURL,
      configURL,
      quantized: true,
      prompt,
      temp: temperature,
      top_p: topP,
      repeatPenalty,
      seed: seed,
      maxSeqLen,
      command: "start",
    });
  };

  return (
    <div>
      <p>Playground...</p>
      <button onClick={handlePrompt}>Start Model</button>
    </div>
  );
};

export default Playground;
