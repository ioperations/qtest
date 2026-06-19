import { useMemo } from 'react';

interface VsCodeApi {
  postMessage: (message: unknown) => void;
  getState: () => unknown;
  setState: (state: unknown) => void;
}

declare global {
  interface Window {
    acquireVsCodeApi: () => VsCodeApi;
  }
}

export function useVsCodeApi(): VsCodeApi {
  const vscode = useMemo(() => {
    if (typeof window !== 'undefined' && window.acquireVsCodeApi) {
      return window.acquireVsCodeApi();
    }
    return {
      postMessage: (message: unknown) => console.log('[Mock VS Code] postMessage:', message),
      getState: () => ({}),
      setState: (state: unknown) => console.log('[Mock VS Code] setState:', state),
    };
  }, []);

  return vscode;
}