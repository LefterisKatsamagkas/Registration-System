import React, { useState, useEffect } from 'react';
import { FaHome, FaUser } from 'react-icons/fa';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';
import { logout } from './Api/userApi.js';
import { toast } from 'react-hot-toast';
import { useAuth } from './context/authContext';
import { useModalContext } from './context/modalContext.js';
import './App.css';

function NavigationMenu() {
  const { userInfo, updateUserContext, logout } = useAuth();
  const location = useLocation();
  const {pathname} = useLocation();
  const { showModal } = useModalContext();

  const linkStyle = {

    color: '#6448ef',
    marginRight: '20px',
  };

  const withoutNavBarRoutes = ["/view-event-page/","/payment-success/"];

  const logoutHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await logout();
      logout();
      window.location.reload();  
    } catch (error) {
      toast.error(error?.data?.message || 'Something went wrong');
    }
  };


  const [rectanglePosition, setRectanglePosition] = useState(100); // Default position
  const [rectangleWidth, setRectangleWidth] = useState(0);
  const [usernameOffset, setUsernameOffset] = useState(0);
  useEffect(() => {
    let newPosition = 100; 
    let newWidth = 0;
    let newOffset = 0;

    if (location.pathname === '/') {
      newPosition = -795; 
      newWidth = 70;
      newOffset = 120;
    } else if (location.pathname === '/event-page') {
      newPosition = -725; 
      newWidth = 60;
      newOffset = 110;
    } else if (location.pathname === '/login' || location.pathname === '/register'){
      newOffset = 50;
    } else if (location.pathname.startsWith('/view-event-page/')){
      newOffset = 50;
    }

    setRectanglePosition(newPosition);
    setRectangleWidth(newWidth);
    setUsernameOffset(newOffset);
  }, [location.pathname]);

  if (withoutNavBarRoutes.some((item) => pathname.includes(item))&&(userInfo===null)) return null;

  return (
    <div className={`NavigationMenu shifted-navbar`}>
      <header>
        <Navbar bg='white' expand='lg' sticky='top' variant='light' className='purple-text purple-shadow' style={{ zIndex: '10', top: '0', width: '100%', height: '90px', paddingTop: '0px', paddingBottom: '0px' }}>
          <Container>
            <LinkContainer to='/'>
              <Navbar.Brand id='me-auto' style={{ ...linkStyle, fontWeight: 'bold', color: '#6448ef' }}>
                Registration System
              </Navbar.Brand>
            </LinkContainer>
            <Nav className='me-auto' style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <NavLink
                to='/'
                exact
                id={location.pathname === '/' ? 'active-link' : 'not-active-link'}
              >
                <FaHome style={{ fontSize: '16px', position: 'relative', top: '-3px' }} /> Home
              </NavLink>
              <NavLink
                to='/event-page'
                id={location.pathname === '/event-page' ? 'active-link' : 'not-active-link'}
              >
                Events
              </NavLink>
            </Nav>
            <Nav className='ml-auto'>
              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username' style={{ left: `${usernameOffset+50}px` }}>
                  <NavDropdown.Item id='dropdown'>Profile</NavDropdown.Item>
                  <NavDropdown.Item id='dropdown' onClick={logoutHandler}>Logout</NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login' style={{ position: 'relative', left: `${usernameOffset}px` }}>
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
            {/* Purple Rectangle */}
            <div className='purple-rectangle' style={{ left: `${rectanglePosition}px`, width: `${rectangleWidth}px` }}></div>
          </Container>
        </Navbar>
      </header>
    </div>
  );
}

export default NavigationMenu;
