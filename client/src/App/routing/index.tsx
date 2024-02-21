import React, { ReactElement } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import Login from 'pages/Login';

import { HOME, LOGIN, PORTFOLIO, REGISTER, TRANSACTIONS } from 'lib/pagesPaths';
import Home from 'pages/Home';
import Register from 'pages/Register';
import Transactions from 'pages/Transactions';
import Portfolio from 'pages/Portfolio';

function Routing(): ReactElement {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={LOGIN} element={<Login />} />
        <Route path={HOME} element={<Home />} />
        <Route path={REGISTER} element={<Register />} />
        <Route path={TRANSACTIONS} element={<Transactions />} />
        <Route path={PORTFOLIO} element={<Portfolio />} />

        <Route path="/*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
