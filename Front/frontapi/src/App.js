import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import About from './Pages/About';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ProfilePatient from './Pages/ProfilePatient';
import ProfileDoctor from './Pages/ProfileDoctor';
import EditPatient from './Pages/EditPatient';
import EditDoctor from './Pages/EditDoctor';
import PatientsAll from './Pages/PatientsAll';
import CreateAppointment from './Pages/CreateAppointment';
import AppointmentAll from './Pages/AppointmentAll';
import EditAppointment from './Pages/EditAppointment';
import Prescription from './Pages/Prescription';
import PatientAppointment from './Pages/PatientAppointment';
import PatientPrescription from './Pages/PatientPrescription';
import Home from './Pages/Home';
import Obraz from './img/logo.png';

function App() {
  const token = localStorage.getItem('token');

  const logout = async () => {
    try {
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (error) {
      console.error('Error:', error);
    }
  };
  return (
    <Router>
      
        <div>
          <nav>
            <div className="nav-items">
              <Link to="/"><img src={Obraz} className="img_logo" alt="Logo gabinetu stomatologicznego" /></Link>
              <Link to="/#container_two">Lekarze</Link>
              <Link to="/about">Uslugi</Link>
              <Link to="/about">Kontakt</Link>
              
            </div>
            <div className="nav-items">
              {token && <a href="#" onClick={logout} className="button">Logout</a>}
              {!token && <a href="/register" className="button">Register</a>}
              {!token && <a href="/login" className="button">Login</a>}
            </div>
          </nav>
      
        <Routes>
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profileDoctor" element={<ProfileDoctor />} />
          <Route path="/profilePatient" element={<ProfilePatient />} />
          <Route path="/editPatient" element={<EditPatient />} />
          <Route path="/editDoctor" element={<EditDoctor />} />
          <Route path="/SelectPatients" element={<PatientsAll />} />
          <Route path="/CreateAppointment" element={<CreateAppointment />} />
          <Route path="/SelectAppointments" element={<AppointmentAll />} />
          <Route path="/editappointment/:id" element={<EditAppointment />} />
          <Route path="/createprescription/:id" element={<Prescription />} />
          <Route path="/receptapacjent/:id" element={<PatientPrescription />} />
          <Route path="/PatientAppointments" element={<PatientAppointment />} />         
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
