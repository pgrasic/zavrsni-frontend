import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: '26px',
        fontWeight: '700',
        textAlign: 'center'
      },
      'form > div': {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1rem'
      },
      label: {
        marginBottom: '0.5rem',
        textAlign: 'center',
        fontSize: '1.5rem',
        lineHeight: '1.2'
      },
      'input, textarea, select': {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'gray.300',
        borderRadius: '8px',
        padding: '0.75rem',
        width: '100%'
      },
      select: {
        maxWidth: '560px'
      },
      button: {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: 'gray.500',
        borderRadius: '10px',
        padding: '1rem 1.25rem',
        background: 'transparent',
        cursor: 'pointer',
        fontSize: '1.1rem'
      },
      'input:focus, textarea:focus, select:focus': {
        boxShadow: '0 0 0 4px rgba(66,153,225,0.35)'
      }
    }
  }
});

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  );
}
