import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { ReactNode } from 'react';

const manifestUrl = `${window.location.origin}/tonconnect-manifest.json`;

interface TonProviderProps {
  children: ReactNode;
}

/**
 * Provider для TON Connect
 * Должен обернуть всё приложение
 */
export function TonProvider({ children }: TonProviderProps) {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      {children}
    </TonConnectUIProvider>
  );
}
