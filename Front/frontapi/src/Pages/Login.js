import React, { useState, useEffect } from "react";
import axios from "../api";
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/LoginToken/", {
        email,
        hashhaslo: password,
      });

      if (response.status === 200) {
        setIsLoggedIn(true);  
        localStorage.setItem("token", response.data.access_token);
        const typ_pacjenta = response.data.typ_uzytkownika;

      if (typ_pacjenta === "Lekarz") {
        window.location.href = "/profileDoctor";
      } else {
        window.location.href = "/profilePatient";
      }
      } else {
        alert("Nieprawidłowy login lub hasło");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      
    }
  }, [isLoggedIn]);

  return (
    <div className="login-form">
      <h1>Logowanie</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          name="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Hasło"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Zaloguj się</button>
      </form>
      <p>Nie posiadasz konta ? <a href="/register">Zarejestruj się</a></p>
      <p>
        {isLoggedIn ? "Zalogowany" : "Niezalogowany"}
      </p>
    </div>
  );
};

export default Login;
