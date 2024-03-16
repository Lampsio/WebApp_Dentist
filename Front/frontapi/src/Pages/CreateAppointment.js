import React, { useState, useEffect } from "react";
import axios from "../api";
import './CreateAppointment.css';

function CreateAppointment() {
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [appointmentDate, setAppointmentDate] = useState('2024-01-05');
  const [appointmentTime, setAppointmentTime] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [user, setUserData] = useState();

  useEffect(() => {
    const getToken = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/select/doctors', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            setDoctors(response.data);
          });
      }
    };

    const getServices = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('/select/services', { headers: { Authorization: `Bearer ${token}` } })
          .then((response) => {
            setServices(response.data);
          });
      }
    };

    const getUser = async () => {
        const token = localStorage.getItem('token');
  
        if (token) {
          await axios.get('/profile/pacjent', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
            .then((response) => {
              setUserData(response.data);
            });
        }
      };

    Promise.all([getToken(), getServices(),getUser()]);
  }, []);

  const token = localStorage.getItem('token');
  if (!token) {
    return <div>Loading...</div>;
  }

  const doctorOptions = doctors.map((doctor) => (
    <option key={doctor.id} value={doctor.id}>{`${doctor.imie} ${doctor.nazwisko}`}</option>
  ));

  const handleDoctorSelect = (event) => {
    setSelectedDoctor(event.target.value);
  };

  const handleAppointmentDateChange = (event) => {
    setAppointmentDate(event.target.value);
  };

  const handleAppointmentTimeChange = (event) => {
    setAppointmentTime(event.target.value);
  };

  const handleServiceSelect = (event) => {
    const selectedService = event.target.value;
    if (selectedServices.includes(selectedService)) {
      selectedServices.splice(selectedServices.indexOf(selectedService), 1);
    } else {
      selectedServices.push(selectedService);
    }
    setSelectedServices(selectedServices);
  };

  const submitAppointment = async () => {
    const appointmentData = {
      doctorId: selectedDoctor,
      appointmentDate: appointmentDate,
      appointmentTime: appointmentTime,
      services: selectedServices,
      IdPatient: user.id
    };
    
    console.log("doctorId:", appointmentData.doctorId);
    console.log("appointmentDate:", appointmentData.appointmentDate);
    console.log("appointmentTime:", appointmentData.appointmentTime);
    console.log("services:", appointmentData.services);
    console.log("IdPatient:", appointmentData.IdPatient);

    console.log("Type of appointmentDate:", typeof appointmentData.appointmentDate);
    console.log("Type of appointmentTime:", typeof appointmentData.appointmentTime);
    console.log("Type of services:", typeof appointmentData.services);
    console.log("Type of IdPatient:", typeof appointmentData.IdPatient);

    try {
      await axios.post('/create/appointment', appointmentData);
      alert('Appointment created successfully!');
    } catch (error) {
      alert('Error creating appointment:', error.message);
    }
  };

  return (
    <div class="create-appointment">
    <div>
      <h1 class="create">Create Appointment</h1>

      <div>
        <label htmlFor="doctor">Lekarz: </label>
        <select name="doctor" id="doctor" onChange={handleDoctorSelect}>
          {doctorOptions}
        </select>
      </div>

      <div>
        <label htmlFor="appointmentDate">Data wizyty: </label>
        <input type="text" name="appointmentDate" id="appointmentDate" value={appointmentDate} onChange={handleAppointmentDateChange} />
      </div>

      <div>
        <label htmlFor="appointmentTime">Godzina wizyty: </label>
        <input type="time" name="appointmentTime" id="appointmentTime" value={appointmentTime} onChange={handleAppointmentTimeChange} />
      </div>

      <div>
        <label htmlFor="services">Usługi: </label>
        {services.map((service) => (
          <div key={service.id}>
            <input type="checkbox" value={service.id} onChange={handleServiceSelect} /> {service.nazwa}
            <span> (Cena: {service.cena})</span>
          </div>
        ))}
      </div>
      

      <button class="butto" onClick={submitAppointment}>Create Appointment</button>
    </div>
    </div>
  );
}

export default CreateAppointment;