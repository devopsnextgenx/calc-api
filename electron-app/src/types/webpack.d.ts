// Webpack HMR types
declare namespace NodeJS {
  interface Module {
    hot?: {
      accept: (path?: string | string[], callback?: () => void) => void;
      decline: (path?: string | string[]) => void;
      dispose: (callback: (data: any) => void) => void;
      addDisposeHandler: (callback: (data: any) => void) => void;
      removeDisposeHandler: (callback: (data: any) => void) => void;
      invalidate: () => void;
      check: (autoApply?: boolean) => Promise<string[] | null>;
      apply: (options?: any) => Promise<string[] | null>;
      status: () => string;
      addStatusHandler: (callback: (status: string) => void) => void;
      removeStatusHandler: (callback: (status: string) => void) => void;
    };
  }
}

// Process env types
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
  }
}
