import React, { useState, useEffect } from "react";
import axios from "../api";
import './PatientPrescription.css';

const Prescription = () => {
  const [idWizyta, setIdWizyta] = useState('');
  const [receptaData, setReceptaData] = useState();

   useEffect(() => {
    const idWizytaFromLink = window.location.pathname.split('/')[2];
    setIdWizyta(idWizytaFromLink);
    console.log(idWizytaFromLink)

    const fetchData = async () => {
      try {
        const response = await axios.post(`/Select/Recepta/${idWizytaFromLink}`);
        setReceptaData(response.data);
      } catch (error) {
        if (error.response.status === 401) {
          // Token jest nieprawidłowy lub wygasł.
          // Przekieruj użytkownika do strony logowania.
          //window.location.href = "/login";
        } else {
          // Wystąpił inny błąd.
          console.error(error);
        }
      }
    };
    fetchData();
  }, []);

  if (!receptaData) {
    return <div>Nie można załadować danych</div>;
  }

  return (
    <div className="prescription-data">
      <h3>Prescription Data</h3>
      <p className="name">ID: {receptaData.id}</p>
      <p className="name">Wizyta ID: {receptaData.wizyta_id}</p>
      <p className="name">Wystawiający lekarz: {receptaData.lekarz_id}</p>
      <p className="name">Data Wystawienia: {receptaData.data_wystawienia.slice(0, 10)}</p>
      <p className="name">Data Ważności: {receptaData.data_waznosci.slice(0, 10)}</p>
      <p className="name">Nazwa leku: {receptaData.nazwa_leku}</p>
      <p className="name">dawka: {receptaData.dawka}</p>
      <p className="name">liczba dawek: {receptaData.liczba_dawek}</p>
    </div>
  );
};

export default Prescription;
