export interface CurrentSidebar {
  node: HTMLElement;
  teardown: () => void;
  child: Node;
  offsetKey: string;
}
