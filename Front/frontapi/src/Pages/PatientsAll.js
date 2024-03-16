import React, { useState, useEffect } from "react";
import axios from "../api";

function PatientsAll() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/selectpatient2/', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            setPatients(response.data);
          });
      }
    };

    getToken();
  }, []);

  const token = localStorage.getItem('token');
  if (!token) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Lista pacjentów</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>PESEL</th>
            <th>Data urodzenia</th>
            <th>Adres</th>
            <th>Numer telefonu</th>
          </tr>
        </thead>
        <tbody>
          {patients.map((patient) => (
            <tr key={patient.id_pacjent}>
              <td>{patient.id_pacjent}</td>
              <td>{patient.imie}</td>
              <td>{patient.nazwisko}</td>
              <td>{patient.pesel}</td>
              <td>{patient.data_urodzenia}</td>
              <td>{patient.adres}</td>
              <td>{patient.numer_tel}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PatientsAll;