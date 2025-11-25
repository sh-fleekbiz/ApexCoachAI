/// <reference types="vite/client" />

declare module '/chat-component.js' {
  const content: any;
  export default content;
}

import type * as React from 'react';
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ['chat-component']: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}
