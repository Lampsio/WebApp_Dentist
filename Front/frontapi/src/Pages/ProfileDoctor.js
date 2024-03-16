import React, { useState, useEffect } from 'react';
import axios from '../api';

const ProfileDoctor = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.get('/profile/lekarz', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            setUserData(response.data);
          });
      }
    };

    getToken();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="profile">
      <h1 className="doc_profile">Doctor Profile</h1>
      <p>Email: {userData.email}</p>
      <p>Imię: {userData.imie}</p>
      <p>Nazwisko: {userData.nazwisko}</p>
      <p>Specjalizacja: {userData.specjalnosc}</p>
      <p>Numer telefonu: {userData.numer_telefonu}</p>
      <p>Nazwa gabinetu: {userData.gabinet_nazwa}</p>
      <p>Opis gabinetu: {userData.gabinet_opis}</p>

      <button type="button" onClick={() => {window.location.href = `/SelectAppointments`;}}>Wyświetl wizyty</button>
      <button onClick={logout}>Wyloguj się</button>
    </div>
  );
};

export default ProfileDoctor;
