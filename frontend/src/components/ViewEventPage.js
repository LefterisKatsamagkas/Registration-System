import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';
import RegistrantEventPage from './RegistrantEventPage';
import AdminEventPage from './AdminEventPage';

export default function ViewEventPage() {
  const { userInfo, isLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!isLoading && userInfo) {
      setIsAdmin(userInfo.isAdmin);
    }
  }, [isLoading, userInfo]);



  return (
    <div className='view-event-page'>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAdmin ? (
        <AdminEventPage />
      ) : (
        <div>
          <RegistrantEventPage />
        </div>
      )}
    </div>
  );
}