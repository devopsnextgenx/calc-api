export {};

declare global {
    interface Window {
        electron: {
            ipcRenderer: {
                invoke(channel: string, ...args: any[]): Promise<any>;
            };
        };
        ffi: {
            Library: (libPath: string, funcs: any) => any;
        };
        libb64: any;
    }
}