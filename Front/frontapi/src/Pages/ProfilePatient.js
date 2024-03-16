import React, { useState, useEffect } from 'react';
import axios from '../api';
import './ProfilePatient.css';

const ProfilePatient = () => {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.get('/profile/pacjent', { headers: { Authorization: `Bearer ${token}` } })
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
      <h1>Patient Profile</h1>
      <p>Email: {userData.email}</p>
      <p>Imię: {userData.imie}</p>
      <p>Nazwisko: {userData.nazwisko}</p>
      <p>Pesel: {userData.pesel}</p>
      <p>Data urodzenia: {userData.data_urodzenia.slice(0, 10)}</p>
      <p>Adres: {userData.adres}</p>
      <p>Numer telefonu: {userData.numer_tel}</p>

      <button type="button" onClick={() => {
                    window.location.href = `/CreateAppointment`;
              }}>Stwórz Wizytę</button>
      <button type="button" onClick={() => {
                    window.location.href = `/PatientAppointments`;
              }}>Moje Wizyty</button>
      <button onClick={logout}>Wyloguj się</button>
    </div>
  );
};

export default ProfilePatient;
