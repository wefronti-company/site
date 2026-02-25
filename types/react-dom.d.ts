declare module 'react-dom' {
  import type { ReactNode } from 'react';
  export function createPortal(child: ReactNode, container: Element | DocumentFragment): ReactNode;
}
