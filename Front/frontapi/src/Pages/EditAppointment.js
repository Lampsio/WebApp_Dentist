import React, { useState, useEffect } from "react";
import axios from "../api";
import './EditAppointment.css';

function Editappointment() {
    const [idWizyta, setIdWizyta] = useState('');
    const [wizyta, setWizyta] = useState([]);
    
  useEffect(() => {
    // Odebranie wartości z ścieżki URL
    const idWizytaFromLink = window.location.pathname.split('/')[2];
    setIdWizyta(idWizytaFromLink);

    // Pobranie danych wizyty z API
    axios.post("/selectwizyta/" + idWizytaFromLink, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        setWizyta(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Przetworzenie danych z formularza
    const data = {
      godzina: e.target.godzina.value,
      data_wizyta: e.target.data_wizyta.value,
      diagnoza: e.target.diagnoza.value,
      status: e.target.status.value,
    };

    console.log(data);

    // Wysłanie danych do API
    const idWizytaAsInt = parseInt(idWizyta);
    axios.post("/wizyty/edit/" + idWizyta, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    const updatedUserData = { ...wizyta };
    updatedUserData[name] = value;
    setWizyta(updatedUserData);
  };

  return (
    <div class="edit-appointment">
      <h1>Edycja wizyty: {idWizyta}</h1>
     

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="name">Godzina</label>
          <input
            type="time"
            className="form-control"
            name="godzina"
            value={wizyta.godzina}
            required
            onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="name">Data wizyty</label>
          <input
            type="text"
            className="form-control"
            name="data_wizyta"
            value={wizyta.data_wizyta}
            required
            maxlength="10"
            data-mask="YYYY-MM-DD"
          onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="name">Diagnoza</label>
          <textarea
            className="form-control"
            name="diagnoza"
            value={wizyta.diagnoza}
            required
          onChange={handleInputChange}
          />
        </div>

        <div className="form-group">
          <label className="name">Status</label>
          <select
            className="form-control"
            name="status"
            value={wizyta.status}
            required
          onChange={handleInputChange}
          >
            <option value="Zaplanowana">Zaplanowana</option>
            <option value="Zakończona">Zakończona</option>
            <option value="Anulowana">Anulowana</option>
          </select>
        </div>

        <button type="submit">Zapisz</button>
      </form>
    </div>
  );
}

export default Editappointment;
