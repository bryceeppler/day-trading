import React, { FC } from 'react';
import Presentation from './Presentation';

interface LayoutPresentationProps {
  children: React.ReactNode;
  setSearch?: React.Dispatch<React.SetStateAction<string>>;
  openAlert?: boolean;
  alertTitle?: string;
  alertMessage?: string;
  onAlertClose?: () => void;
}

const Layout: FC<LayoutPresentationProps> = (props) => {
  return <Presentation {...props} />;
};

export default Layout;
