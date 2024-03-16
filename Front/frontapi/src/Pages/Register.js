import React, { useState } from 'react';
import axios from '../api';
import './Register.css';

function Register() {
  const [patientData, setPatientData] = useState({
    email: '',
    hashhaslo: '',
    typ_uzytkownika: 'Pacjent',
    imie: '',
    pesel: '',
    nazwisko: '',
    data_urodzenia: '',
    adres: '',
    numer_tel: '',
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post('/patients/', patientData);
      setSuccess(true);
      setPatientData({
        email: '',
        hashhaslo: '',
        typ_uzytkownika: 'Pacjent',
        imie: '',
        pesel: '',
        nazwisko: '',
        data_urodzenia: '',
        adres: '',
        numer_tel: '',
      });
    } catch (error) {
      setError(error.response.data.detail);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPatientData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <div className="register-container">
      <h3 className="title">Panel Rejestracji Pacjenta</h3>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {success && <div style={{ color: 'green' }}>Konto zostało utworzone</div>}
      <form onSubmit={handleSubmit}>
        <label className="label">
          Email:
          <input type="email" name="email" value={patientData.email} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Hasło:
          <input type="password" name="hashhaslo" value={patientData.hashhaslo} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Imię:
          <input type="text" name="imie" value={patientData.imie} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Nazwisko:
          <input type="text" name="nazwisko" value={patientData.nazwisko} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Pesel:
          <input type="text" name="pesel" value={patientData.pesel} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Data urodzenia:
          <input type="date" name="data_urodzenia" value={patientData.data_urodzenia} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Adres:
          <input type="text" name="adres" value={patientData.adres} onChange={handleChange} />
        </label>
        <br />
        <label className="label">
          Numer telefonu:
          <input type="text" name="numer_tel" value={patientData.numer_tel} onChange={handleChange} />
        </label>
        <br />
        <button className="button" type="submit">Utwórz pacjenta</button>
      </form>
    </div>
  );
}

export default Register;
