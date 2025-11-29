/// <reference types="vite/client" />

declare module '/chat-component.js' {
  const content: any;
  export default content;
}

import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'chat-component': any;
    }
  }
}
