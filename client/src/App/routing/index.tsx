import React, { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from 'pages/Login';

import { HOME, LOGIN } from 'lib/pagesPaths';
import Home from 'pages/Home';

function Routing(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={HOME} element={<Home />} />

        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
