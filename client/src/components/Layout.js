import React from 'react';
import Sidebar from './Sidebar';
import { styled } from '@mui/material/styles';

const LayoutContainer = styled('div')({
  display: 'flex',
});

const MainContent = styled('div')({
  marginLeft: '250px', // Width of the sidebar
  padding: '20px',
  width: '100%',
});

const Layout = ({ children, userRole }) => {
  return (
    <LayoutContainer>
      <Sidebar userRole={userRole} />
      <MainContent>
        {children}
      </MainContent>
    </LayoutContainer>
  );
};

export default Layout;