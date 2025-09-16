import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/authContext';
import NavigationMenu from './NavigationMenu';
import LoginPage from './components/LoginPage';
import HomePage from './components/HomePage';
import RegisterPage from './components/RegisterPage';
import { Toaster } from 'react-hot-toast';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import EventPage from './components/EventPage';
import { ModalProvider } from './context/modalContext';
import ViewEventPage from './components/ViewEventPage';
import StripeSuccessPage from './components/StripeSuccessPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ModalProvider>
          <div>
            <NavigationMenu />

            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/event-page" element={<EventPage />} />
              </Route>
            </Routes>
          </div>

          {/* This Route is outside the navigation bar div */}
          <Routes>
            <Route path="/view-event-page/:id" element={<ViewEventPage />} />
            <Route path="/payment-success/:id/info" element={<StripeSuccessPage/>} />
          </Routes>

          <Toaster />
        </ModalProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;