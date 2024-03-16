import React, { useState, useEffect } from "react";
import axios from "../api";
import './PatientAppointment.css';

function PatientAppointment() {
  const [wizyty, setWizyty] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('/wizyty/pacjent', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const wizytyData = response.data;
        setWizyty(wizytyData);
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

  const renderWizyty = () => {
    return wizyty.map((wizyta) => (
      <div key={wizyta.id_wizyta} className="appointment">
        <h3>{wizyta.id_wizyta}</h3>
        <p>
          <label className="name">Pacjent: </label>
          {wizyta.pacjent_imie} {wizyta.pacjent_nazwisko}
        </p>
        <p>
          <label className="name">Lekarz: </label>
          {wizyta.lekarz_imie} {wizyta.lekarz_nazwisko}
        </p>
        <p>
          <label className="name">Status: </label>
          {wizyta.status}
        </p>
        <p>
          <label className="name">Gabinet: </label>
          {wizyta.gabinet}
        </p>
        <p>
          <label className="name">Godzina: </label>
          {wizyta.godzina}
        </p>
        <p>
          <label className="name">Data: </label>
          {wizyta.data_wizyta.slice(0, 10)}
        </p>
        <ul className="list-unstyled">
        <label className="name">Uslugi: </label>
          {wizyta.uslugi.map((usluga) => (
            <li key={usluga}>{usluga}</li>
          ))}
        </ul>
        <button type="button" className="butto-rece" onClick={() => {
                    window.location.href = `/receptapacjent/${wizyta.id_wizyta}`;
              }}>Recepta</button>
      </div>
    
    ));
  };

  const renderBrakWizyt = () => (
    <div className="alert alert-info">
      <h2>Nie masz żadnych wizyt.</h2>
    </div>
  );

  return (
    <div className="patient-appointments">
      {wizyty.length > 0 ? renderWizyty() : renderBrakWizyt()}
    </div>
  );
}

export default PatientAppointment;
