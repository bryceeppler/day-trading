import React, { createContext, ReactElement, ReactNode, useState } from 'react';
import { GlobalMessage } from 'types/utils.types';

interface GlobalActionsInfo {
  globalMessage?: GlobalMessage;
  setGlobalMessage: (globalMessage: GlobalMessage) => void;
  resetGlobalMessage: () => void;
}

interface GlobalActionProviderProps {
  children: ReactNode;
}

const GlobalActionsContext = createContext<GlobalActionsInfo>({
  globalMessage: undefined,
  setGlobalMessage: () => null,
  resetGlobalMessage: () => null,
});

const { Provider } = GlobalActionsContext;

function GlobalActionProvider({ children }: GlobalActionProviderProps): ReactElement {
  const [globalMessage, setGlobalMessage] = useState<GlobalMessage>();

  const resetGlobalMessage = () => setGlobalMessage(undefined);

  return <Provider value={{ globalMessage, setGlobalMessage, resetGlobalMessage }}>{children}</Provider>;
}

export { GlobalActionsContext, GlobalActionProvider };
