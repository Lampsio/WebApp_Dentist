import React, { useState, useEffect } from "react";
import axios from "../api";
import './AppointmentAll.css';

function AppointmentAll() {
    const [wizyty, setWizyty] = useState([]);
    const token = localStorage.getItem("token");
  
    useEffect(() => {
      const fetchData = async () => {
  try {
    const response = await axios.get("/selectwizyty/", {
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
      window.location.href = "/login";
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
            </p><br/>
            <ul className="list-unstyled">
            <label className="name">Uslugi: </label>
              {wizyta.uslugi.map((usluga) => (
                <li key={usluga}>{usluga}</li>
              ))}
            </ul>
            <div>
            <button type="button" className="button" onClick={() => {
                    window.location.href = `/editappointment/${wizyta.id_wizyta}`
              }}>Edytuj Wizytę</button>
              <button type="button" className="button" onClick={() => 
                    {window.location.href = `/createprescription/${wizyta.id_wizyta}`
              }}>Przejdź do Recepty</button>
          </div>
          </div>
        ));
      };
  
    return (
      <div className="appointments">
        {renderWizyty()}
      </div>
    );
  }
  
  export default AppointmentAll;