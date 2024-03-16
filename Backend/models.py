from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Numeric, DateTime , Date
import datetime
from sqlalchemy.orm import relationship
from sqlalchemy.schema import UniqueConstraint
from database import Base

class UserTable(Base):
  __tablename__ = 'uzytkownik'

  id_uzytkownik = Column(Integer, primary_key=True, autoincrement=True)
  email = Column(String(50), nullable=False)
  hashhaslo = Column(String, nullable=False)
  typ_uzytkownika = Column(String, nullable=False)


class PacjentTable(Base):
  __tablename__ = 'pacjent'

  id_pacjent = Column(Integer, primary_key=True, autoincrement=True)
  id_uzytkownik = Column(Integer, ForeignKey('uzytkownik.id_uzytkownik'))
  imie = Column(String(50), nullable=False)
  pesel = Column(String(12), nullable=False)
  nazwisko = Column(String(50), nullable=False)
  data_urodzenia = Column(DateTime, nullable=False)
  adres = Column(String(255), nullable=False)
  numer_tel = Column(String(20), nullable=False)

  def __repr__(self):
      return f"<PacjentTable(id_pacjent={self.id_pacjent}, id_uzytkownik={self.id_uzytkownik}, imie='{self.imie}', pesel='{self.pesel}', nazwisko='{self.nazwisko}', data_urodzenia='{self.data_urodzenia}', adres='{self.adres}', numer_tel='{self.numer_tel}')>"

class GabinetTable(Base):
  __tablename__ = 'gabinet'

  id_gabinet = Column(Integer, primary_key=True, autoincrement=True)
  nazwa = Column(String(10), nullable=False)
  opis = Column(String(255))

class LekarzTable(Base):
  __tablename__ = 'lekarz'

  id_lekarz = Column(Integer, primary_key=True, autoincrement=True)
  id_uzytkownik = Column(Integer, ForeignKey('uzytkownik.id_uzytkownik'))
  gabinet_id = Column(Integer, ForeignKey('gabinet.id_gabinet'))
  imie = Column(String(50), nullable=False)
  nazwisko = Column(String(50), nullable=False)
  specjalnosc = Column(String(50), nullable=False)
  numer_telefonu = Column(String(50), nullable=False)

  def __repr__(self):
      return f"<LekarzTable(id_lekarz={self.id_lekarz}, id_uzytkownik={self.id_uzytkownik}, gabinet_id='{self.gabinet_id}', imie='{self.imie}', nazwisko='{self.nazwisko}', specjalnosc='{self.specjalnosc}', numer_telefonu='{self.numer_telefonu}', gabinet='{self.gabinet_id}')>"

class UslugaTable(Base):
  __tablename__ = 'usluga'

  id_uslugi = Column(Integer, primary_key=True, autoincrement=True)
  nazwa = Column(String(255), nullable=False)
  cena = Column(Numeric(10, 2), nullable=False)
  opis = Column(String(500))


class WizytaTable(Base):
  __tablename__ = 'wizyta'

  id_wizyta = Column(Integer, primary_key=True, autoincrement=True)
  gabinet = Column(String(10), nullable=False)
  pacjent_id = Column(Integer, ForeignKey('pacjent.id_pacjent'))
  lekarz_id = Column(Integer, ForeignKey('lekarz.id_lekarz'))
  godzina = Column(String(5), nullable=False)
  data_wizyta = Column(DateTime, nullable=False)
  cena = Column(Numeric(10, 2))
  data_utworzenia = Column(DateTime)
  diagnoza = Column(String(255))
  status = Column(String(50), nullable=False)

  def __repr__(self):
        return f"<WizytaTable(id_wizyta={self.id_wizyta}, gabinet='{self.gabinet}', pacjent_id={self.pacjent_id}, lekarz_id={self.lekarz_id}, godzina='{self.godzina}', data_wizyta='{self.data_wizyta}', cena={self.cena}, data_utworzenia='{self.data_utworzenia}', diagnoza='{self.diagnoza}', status='{self.status}')>"

class WizytaUslugaTable(Base):
  __tablename__ = 'wizytausluga'

  id_wizytausluga = Column(Integer, primary_key=True, autoincrement=True)
  wizyta_id = Column(Integer, ForeignKey('wizyta.id_wizyta'))
  usluga_id = Column(Integer, ForeignKey('usluga.id_uslugi'))


class ReceptaTable(Base):
  __tablename__ = 'recepta'

  id_recepta = Column(Integer, primary_key=True, autoincrement=True)
  wizyta_id = Column(Integer, ForeignKey('wizyta.id_wizyta'))
  lekarz_id = Column(Integer, ForeignKey('lekarz.id_lekarz'))
  data_wystawienia = Column(DateTime)
  data_waznosci = Column(DateTime, nullable=False)
  nazwa_leku = Column(String(255), nullable=False)
  dawka = Column(String(255))
  liczba_dawek = Column(Integer)

 
