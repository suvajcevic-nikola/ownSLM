export {};

declare global {
  interface Window {
    phiWorker: Worker | null;
  }
}