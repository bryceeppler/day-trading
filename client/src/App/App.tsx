import FullWrapper from 'Base/FullWrapper';
import { AuthorizationProvider } from 'context/auth';
import { UserProfileProvider } from 'context/userProfile';
import React, { ReactElement } from 'react';
import './App.scss';
import Routing from './routing';
import { GlobalActionProvider } from 'context/globalActions';

function App(): ReactElement {
  return (
    <AuthorizationProvider>
      <UserProfileProvider>
        <GlobalActionProvider>
          <FullWrapper>
            <Routing />
          </FullWrapper>
        </GlobalActionProvider>
      </UserProfileProvider>
    </AuthorizationProvider>
  );
}

export default App;
