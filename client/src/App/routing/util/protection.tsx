import { ReactElement, useContext } from 'react';
import { AuthorizationContext } from 'context/auth';

const protect = (desiredElement: ReactElement, errorElement: ReactElement) => {
  function Protector(): ReactElement {
    const authorizationContext = useContext(AuthorizationContext);
    if (authorizationContext.userType) return desiredElement;
    return errorElement;
  }
  return Protector;
};

export { protect };
