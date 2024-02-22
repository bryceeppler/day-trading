import { ReactElement } from 'react';

interface FullWrapperProps {
  children: ReactElement;
}

function FullWrapper({ children }: FullWrapperProps): ReactElement {
  return children;
}

export default FullWrapper;
