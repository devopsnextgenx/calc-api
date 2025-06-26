export interface CalcNapi {
  createInstance: (license: string) => Promise<{ success: boolean; version?: string; error?: string }>;
  add: (a: number, b: number) => Promise<number>;
  sub: (a: number, b: number) => Promise<number>;
  mul: (a: number, b: number) => Promise<number>;
  divx: (a: number, b: number) => Promise<number>;
  sqr: (a: number) => Promise<number>;
  getVersion: () => Promise<string>;
  getUsage: () => Promise<string>;
}

export interface IElectronAPI {
  pathLoader: {
    invoke(channel: string, ...args: any[]): Promise<any>;
  };
  openOAuthWindow: (url: string) => Promise<void>;
  onOAuthAccessCode: (callback: (event: any, accessCode: string) => void) => void;
  removeOAuthAccessCode: (callback: (event: any, accessCode: string) => void) => void;
  getLatestAccessCode: () => Promise<string | null>;
  getClientAppConfig: () => Promise<{
    clientId: string;
    clientSecret: string;
    redirectUri: string;
  }>;
  calcNapi: CalcNapi;
}

declare global {
  interface Window {
    electron: IElectronAPI;
  }
}