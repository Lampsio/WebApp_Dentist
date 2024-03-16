import React, { useState, useEffect } from 'react';
import axios from '../api';

function Select() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios.post('/selectpatient2/')
      .then(response => {
        setPatients(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <h1>Lista pacjentów</h1>
      <table>
        <thead>
          <tr>
            <th>ID pacjenta</th>
            <th>Imię</th>
            <th>Nazwisko</th>
            <th>PESEL</th>
            <th>Data urodzenia</th>
            <th>Adres</th>
            <th>Numer telefonu</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(patient => (
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

export default Select;
