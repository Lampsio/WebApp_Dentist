import React, { useState, useEffect } from "react";
import axios from "../api";
import './Prescription.css';


const Prescription = () => {
  const [userData, setUserData] = useState();
  const [idWizyta, setIdWizyta] = useState('');
  const [receptaData, setReceptaData] = useState();

  useEffect(() => {
    // Odebranie wartości z ścieżki URL
    const idWizytaFromLink = window.location.pathname.split('/')[2];
    setIdWizyta(idWizytaFromLink);

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

    const getReceptaData = async () => {
      const response = await axios.post(`/Select/Recepta/${idWizytaFromLink}`);
      setReceptaData(response.data);
    };

    getReceptaData();
  }, [idWizyta]);

  if (!userData) {
    return <div>Brak Autoruzacji...</div>;
  }

  if (!receptaData) {
    return <div>Nie można załadować danych</div>;
  }

  return (
    <div class="prescription">
      <h3>Prescription Data</h3>
      <p class="prescription-data">ID: {receptaData.id}</p>
      <p class="prescription-data"> Visit ID: {receptaData.wizyta_id}</p>
      <p class="prescription-data">Doctor: {receptaData.lekarz_id}</p>
      <p class="prescription-data">Issued Date: {receptaData.data_wystawienia.slice(0, 10)}</p>
      <p class="prescription-data">Expiration Date: {receptaData.data_waznosci.slice(0, 10)}</p>
      <p>
        <label htmlFor="nazwaLeku">Nazwa leku</label>
        <input type="text" id="nazwaLeku" value={receptaData.nazwa_leku} onChange={(e) => setReceptaData({...receptaData, nazwa_leku: e.target.value})} />
      </p>
      <p>
        <label htmlFor="dawka">Dawka</label>
        <input type="text" id="dawka" value={receptaData.dawka} onChange={(e) => setReceptaData({...receptaData, dawka: e.target.value})}/>
      </p>
      <p>
        <label htmlFor="liczbaDawek">Liczba dawek</label>
        <input type="number" id="liczbaDawek" value={receptaData.liczba_dawek} onChange={(e) => setReceptaData({...receptaData, liczba_dawek: e.target.value})} />
      </p>
      <button onClick={() => editRecepta()}>Edytuj</button>
    </div>
  );

  function editRecepta() {
    const receptaDataToEdit = {
      id: receptaData.id,
      nazwa_leku: document.getElementById("nazwaLeku").value,
      dawka: document.getElementById("dawka").value,
      liczba_dawek: document.getElementById("liczbaDawek").value,
    };

    // Wyświetl wartości pól input
  console.log(receptaDataToEdit.nazwa_leku);
  console.log(receptaDataToEdit.dawka);
  console.log(receptaDataToEdit.liczba_dawek);

    axios.post(`/recepta/edit/${receptaData.id}`, receptaDataToEdit);
  }
};

export default Prescription;
