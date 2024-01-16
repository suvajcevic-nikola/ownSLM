import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { PowerGrid } from "../components";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";

type Props = {
  phiWorker: Worker | null;
};

type PhiWorkerData = {
  message: string;
  prompt: string;
  sentence: string;
  output: string;
  status: "loading" | "generating" | "complete";
  token: string;
  tokenSec: number;
  totalTime: number;
};

const Playground = ({ phiWorker }: Props) => {
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

  const [phiWorkerData, setPhiWorkerData] = useState<PhiWorkerData>();
  const [lastSentence, setLastSentence] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");

  const isUserInputEmpty = userInput?.trim()?.length === 0;

  const handlePrompt = () => {
    if (!phiWorker) return;

    phiWorker.postMessage({
      weightsURL,
      modelID,
      tokenizerURL,
      configURL,
      quantized: true,
      prompt: userInput,
      temp: temperature,
      top_p: topP,
      repeatPenalty,
      seed: seed,
      maxSeqLen,
      command: "start",
    });
  };

  const handleTextAreChange = (event: React.ChangeEvent<HTMLTextAreaElement>) =>
    setUserInput(event.target.value);

  useEffect(() => {
    if (!phiWorker) return;

    phiWorker.onmessage = (event: MessageEvent<string>) => {
      setPhiWorkerData(event.data as unknown as PhiWorkerData);

      const { sentence } = event.data as unknown as PhiWorkerData;
      if (!sentence) return;
      setLastSentence(sentence);
    };
  }, [phiWorker]);

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (isUserInputEmpty) return;

      handlePrompt();
    }
  };

  if (!phiWorker) {
    return (
      <div className="w-full flex justify-center items-center">
        <p>phiWorker is not ready</p>
      </div>
    );
  }

  const handleNewPrompt = () => {
    phiWorker.postMessage({ command: "abort" });
    setUserInput("");
    setPhiWorkerData(undefined);
    setLastSentence("");
  };

  if (!phiWorkerData) {
    return (
      <div className="w-full flex flex-col gap-32 justify-center items-center">
        <PowerGrid />
        <div className="w-full max-w-[680px] px-8 flex justify-center items-center gap-4">
          <textarea
            className="w-full text-2xl h-10 px-2 py-1 rounded-lg ring-[1px] ring-neutral-500 hover:border-emerald-300 focus:border-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            value={userInput}
            placeholder="Ask a question"
            onChange={handleTextAreChange}
            onKeyDown={handleKeyPress}
          />
          <button
            className="flex justify-center items-center rounded-full border border-transparent w-12 aspect-square text-lg font-semibold bg-neutral-900 hover:border-emerald-300 focus:border-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
            onClick={handlePrompt}
            disabled={isUserInputEmpty}
          >
            <PaperAirplaneIcon
              className={clsx(
                "w-5 h-5",
                isUserInputEmpty ? "text-neutral-700" : "text-emerald-300"
              )}
            />
          </button>
        </div>
      </div>
    );
  }

  const { status, message } = phiWorkerData;

  return (
    <div className="w-full px-8 h-full flex justify-center items-center">
      <div className="w-full max-w-[680px] flex flex-col justify-center gap-4 text-start">
        <button
          className="w-28 flex justify-center items-center rounded-lg border border-transparent py-2 px-3 text-sm font-semibold bg-neutral-900 hover:border-emerald-300 focus:border-emerald-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-200"
          onClick={handleNewPrompt}
        >
          New Prompt
        </button>
        <div>
          <div className="text-4xl text-emerald-300 delayed-component">
            {userInput}
          </div>
          <div>
            <div className="text-base text-neutral-500 delayed-component">
              {status?.toLocaleUpperCase()}
            </div>
            <div className="text-sm text-neutral-600 delayed-component">
              {message?.toLocaleUpperCase()}
            </div>
          </div>
        </div>
        <ReactMarkdown>{lastSentence ? lastSentence : ""}</ReactMarkdown>
      </div>
    </div>
  );
};

export default Playground;
