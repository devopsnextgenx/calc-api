export interface IElectronAPI {
  ipcRenderer: {
    invoke(channel: string, ...args: any[]): Promise<any>;
    on(channel: string, func: (...args: any[]) => void): void;
    once(channel: string, func: (...args: any[]) => void): void;
  };
  openOAuthWindow: (url: string) => Promise<void>;
  onOAuthAccessCode: (callback: (event: any, accessCode: string) => void) => void;
  removeOAuthAccessCode: (callback: (event: any, accessCode: string) => void) => void;
  getLatestAccessCode: () => Promise<string | null>;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}