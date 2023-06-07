export interface ICustomWindow extends Window {
  cardano: any;
  onResize: any;
  devtools: any;
  DevToolsEvent: any;
  location: any;
  innerWidth: any;
  innerHeight: any;
}

function getWindow(): any {
  return typeof window !== 'undefined' ? window : null;
}

export class WindowRefService {
  get nativeWindow(): ICustomWindow | null {
    return getWindow();
  }
}