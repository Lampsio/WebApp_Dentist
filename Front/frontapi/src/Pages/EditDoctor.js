import React, { useState, useEffect } from 'react';
import axios from '../api';

const EditPatient = () => {
  const [userData, setUserData] = useState();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        await axios.get('/profile/lekarz', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedUserData = { ...userData };
    updatedUserData[name] = value;
    setUserData(updatedUserData);
  };

  return (
    <div className="profile">
      <h1>Patient Profile</h1>

      <div className="form-group">
        <label>Imie:</label>
        <input
          type="imie"
          value={userData.imie}
          name="imie"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Nazwisko:</label>
        <input
          type="nazwisko"
          value={userData.nazwisko}
          name="nazwisko"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Specjalizacja:</label>
        <input
          type="text"
          value={userData.specjalnosc}
          name="adres"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label>Numer telefonu:</label>
        <input
          type="tel"
          value={userData.numer_telefonu}
          name="numer_tel"
          maxlength={20}
          required
          onChange={handleInputChange}
        />
      </div>

      <button onClick={() => {
      // Update profile data and set updating flag
      setIsUpdating(true);

      // Make API request to update patient data
      axios.post('/lekarz/edit/' + userData.id, userData)
        .then((response) => { 
          // Profile updated successfully
          console.log('Profile updated successfully');
          setIsUpdating(false);
        })
        .catch((error) => {
          // Error updating profile
          console.error('Error updating profile:', error);
          setIsUpdating(false);
        });
    }}>Zapisz</button>
    </div>
  );
};

export default EditPatient;
