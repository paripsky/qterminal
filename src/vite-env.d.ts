/// <reference types="vite/client" />

import type { IWindow } from 'happy-dom';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends IWindow {}
}
