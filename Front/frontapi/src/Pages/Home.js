import React, { Component } from "react";
import Obraz from '../img/doc.png';
import Profil from '../img/profile.png';
import './Home.css';

class Home extends Component {
  
  render() {
    return (
      <div className="section">
  <div id="container">
    <div className="text">
      <h1>Piękny uśmiech na wyciągnięcie ręki!</h1>
      <p>Skorzystaj z usług naszego gabinetu stomatologicznego, gdzie doświadczeni lekarze zadbają o zdrowie i piękno Twoich zębów.</p>
      <a href="/register" className="button">Zacznijmy razem tworzyć Twój nowy uśmiech!</a>
    </div>
    <div className="image">
      <img src={Obraz} className="img" alt="Logo gabinetu stomatologicznego" />
    </div>
  </div>

  <div id="container_two">
    <h2 className="tytul_home">Nasi Lekarze</h2>

    <div className="lekarze">
      <div className="lekarz">
        <img src={Profil} className="img_d" alt="Logo gabinetu stomatologicznego" />
        <h3>Imię Nazwisko</h3>
        <p>Specjalność</p>
      </div>
      <div className="lekarz">
        <img src={Profil} className="img_d" alt="Logo gabinetu stomatologicznego" />
        <h3>Imię Nazwisko</h3>
        <p>Specjalność</p>
      </div>
      <div className="lekarz">
        <img src={Profil} className="img_d" alt="Logo gabinetu stomatologicznego" />
        <h3>Imię Nazwisko</h3>
        <p>Specjalność</p>
      </div>
      <div className="lekarz">
        <img src={Profil} className="img_d" alt="Logo gabinetu stomatologicznego" />
        <h3>Imię Nazwisko</h3>
        <p>Specjalność</p>
      </div>
      <div className="lekarz">
        <img src={Profil} className="img_d" alt="Logo gabinetu stomatologicznego" />
        <h3>Imię Nazwisko</h3>
        <p>Specjalność</p>
      </div>
      <div className="lekarz">
        <img src={Profil} className="img_d" alt="Logo gabinetu stomatologicznego" />
        <h3>Imię Nazwisko</h3>
        <p>Specjalność</p>
      </div>
    </div>
  </div>
  <div id="container_three">
  <h2 className="tytul_home">Oferowane usługi</h2>

  <div class="uslugi">
    <div class="usluga lewo">
      <h3>Nazwa usługi 1</h3>
      <p>Opis usługi 1</p>
      <span class="cena">Cena: 100 zł</span>
    </div>
    <div class="usluga prawo">
      <h3>Nazwa usługi 2</h3>
      <p>Opis usługi 2</p>
      <span class="cena">Cena: 150 zł</span>
    </div>
    <div class="usluga lewo">
      <h3>Nazwa usługi 3</h3>
      <p>Opis usługi 3</p>
      <span class="cena">Cena: 200 zł</span>
    </div>
    <div class="usluga prawo">
      <h3>Nazwa usługi 4</h3>
      <p>Opis usługi 4</p>
      <span class="cena">Cena: 250 zł</span>
    </div>
    <div class="usluga lewo">
      <h3>Nazwa usługi 5</h3>
      <p>Opis usługi 5</p>
      <span class="cena">Cena: 300 zł</span>
    </div>
    <div class="usluga prawo">
      <h3>Nazwa usługi 6</h3>
      <p>Opis usługi 6</p>
      <span class="cena">Cena: 350 zł</span>
    </div>
    <div class="usluga lewo">
      <h3>Nazwa usługi 7</h3>
      <p>Opis usługi 7</p>
      <span class="cena">Cena: 400 zł</span>
    </div>
  </div>
  </div>
  <div id="container_four" class="bg-success text-white">
    <div className="div-contact">
  <h2 class="tytul_home">Skontaktuj się z nami</h2>

  <form action="wyslij_mail.php" method="post">
    <div class="form-group">
      <label for="imie" className="contact-name">Imię:</label>
      <input type="text" class="form-control" id="imie" name="imie" placeholder="Wpisz swoje imię"></input>
    </div>

    <div class="form-group">
      <label for="nazwisko" className="contact-name">Nazwisko:</label>
      <input type="text" class="form-control" id="nazwisko" name="nazwisko" placeholder="Wpisz swoje nazwisko"></input>
    </div>

    <div class="form-group">
      <label for="email" className="contact-name">Adres email:</label>
      <input type="email" class="form-control" id="email" name="email" placeholder="Wpisz swój adres email"></input>
    </div>

    <div class="form-group">
      <label for="wiadomosc" className="contact-name">Wiadomość:</label>
      <textarea class="form-control" id="wiadomosc" name="wiadomosc" rows="10" cols="50" placeholder="Wpisz swoją wiadomość"></textarea>
    </div>

    <button type="submit" class="btn btn-primary">Wyślij</button>
  </form>
</div>
</div>
  
</div>
    );
  }
}

export default Home;