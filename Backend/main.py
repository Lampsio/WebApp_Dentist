from fastapi import FastAPI, HTTPException, Depends , Response ,Request
from pydantic import BaseModel
from typing import List, Annotated
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session 
from sqlalchemy import create_engine, select
from typing import Optional
from passlib.context import CryptContext

from datetime import timedelta , datetime
from typing import Annotated
from fastapi import APIRouter,Depends,HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from starlette import status
from database import SessionLocal
import models 
from models import *
from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordRequestForm,OAuth2PasswordBearer
from jose import jwt,JWTError
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()
models.Base.metadata.create_all(bind=engine, checkfirst=True)

origins = {
    'http://localhost:3000'
}

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

class CreatePatientRequest(BaseModel):
    email: str
    hashhaslo: str
    imie: str
    pesel: str
    nazwisko: str
    data_urodzenia: str
    adres: str
    numer_tel: str

class EditPatientRequest(BaseModel):
    imie: str
    pesel: str
    nazwisko: str
    adres: str
    numer_tel: str

class CreateDoctorRequest(BaseModel):
    email: str
    hashhaslo: str
    imie: str
    nazwisko: str
    specjalnosc: str
    numer_telefonu: str
    gabinet_id: int

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class User(BaseModel):
    email: str
    hashhaslo: str
    typ_uzytkownika: str
    id_uzytkownik: int


class UserInDB(User):
    id_uzytkownik: int

class Login(BaseModel):
    email: str
    hashhaslo: str

class AboutMe(BaseModel):
    email: str
    pesel: Optional[str] = None
    data_urodzenia: Optional[datetime.datetime] = None
    adres: Optional[str] = None
    numer_tel: Optional[str] = None
    imie: Optional[str] = None
    nazwisko: Optional[str] = None
    specjalnosc: Optional[str] = None
    numer_telefonu: Optional[str] = None
    gabinet_nazwa: Optional[str] = None
    gabinet_opis: Optional[str] = None

class DeletePatientRequest:
    id_uzytkownik: int


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

SECRET_KEY = 'gryfe73hf73hf73jh833ijhf93jr93h3f93373iiigr7339338'
ALGORITM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 30

bcrypt_context = CryptContext(schemes=['bcrypt'],deprecated='auto')

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

db_dependency = Annotated[Session, Depends(get_db)]

def verify_password(plain_password, hashed_password):
    return bcrypt_context.verify(plain_password, hashed_password)

def get_user(db, email: str):
    return db.query(models.UserTable).filter(models.UserTable.email == email).first()

def authenticate_user(db, email: str, hashhaslo: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(hashhaslo, user.hashhaslo):
        return False
    return user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.datetime.utcnow() + expires_delta
    else:
        expire = datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITM)
    return encoded_jwt

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITM)
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Nieprawidłowe dane uwierzytelniające")
        user = db.query(models.UserTable).filter(models.UserTable.email == email).first()
        if user is None:
            raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")
        return User(**user.__dict__)
    except JWTError:
        raise HTTPException(status_code=401, detail="Nieprawidłowe dane uwierzytelniające")


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/LoginToken/")
async def login(login_data: Login, db: Session = Depends(get_db)):
  user = authenticate_user(db, login_data.email, login_data.hashhaslo)
  if not user:
    raise HTTPException(status_code=401, detail="Nieprawidłowy login lub hasło")
  access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
  access_token = create_access_token({"sub": user.email}, expires_delta=access_token_expires)
  response = {"access_token": access_token}
  response["typ_uzytkownika"] = user.typ_uzytkownika
  return response

@app.post("/patients/")
async def create_patient(patient_data: CreatePatientRequest, db: Session = Depends(get_db)):
    # Check if email and pesel already exist
    if db.query(models.UserTable).filter_by(email=patient_data.email).first() is not None or \
            db.query(models.PacjentTable).filter_by(pesel=patient_data.pesel).first() is not None:
        raise HTTPException(status_code=400, detail="Email or PESEL already exists")

    # Create user
    db_user = models.UserTable(email=patient_data.email, hashhaslo=bcrypt_context.hash(patient_data.hashhaslo), typ_uzytkownika='Pacjent')
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # Create patient
    db_patient = models.PacjentTable(id_uzytkownik=db_user.id_uzytkownik, imie=patient_data.imie, pesel=patient_data.pesel, nazwisko=patient_data.nazwisko, data_urodzenia=patient_data.data_urodzenia,adres=patient_data.adres,numer_tel=patient_data.numer_tel)
    db.add(db_patient)
    db.commit()

    return {"message": "Patient created successfully"}


@app.post("/doctors/")
async def create_doctor(doctor_data: CreateDoctorRequest, db: Session = Depends(get_db)):
    db_user = models.UserTable(email=doctor_data.email, hashhaslo=bcrypt_context.hash(doctor_data.hashhaslo), typ_uzytkownika='Lekarz')
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    db.commit()

    db_doctor = models.LekarzTable(id_uzytkownik=db_user.id_uzytkownik, imie=doctor_data.imie, nazwisko=doctor_data.nazwisko, specjalnosc=doctor_data.specjalnosc, numer_telefonu=doctor_data.numer_telefonu,gabinet_id=doctor_data.gabinet_id)
    db.add(db_doctor)
    db.commit()
    return {"message": "Doctor created successfully"}

@app.get("/profile/")
async def read_about_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid authentication credentials")
    user = get_user(db, email=token_data.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    if user.typ_uzytkownika == 'Pacjent':
        patient = db.query(PacjentTable).filter(PacjentTable.id_uzytkownik == user.id_uzytkownik).first()
        if patient is None:
            raise HTTPException(status_code=404, detail="Patient not found")
        return {
            "email": user.email,
            "pesel": patient.pesel,
            "data_urodzenia": patient.data_urodzenia,
            "adres": patient.adres,
            "numer_tel": patient.numer_tel
        }
    elif user.typ_uzytkownika == 'Lekarz':
        doctor = db.query(LekarzTable).filter(LekarzTable.id_uzytkownik == user.id_uzytkownik).first()
        if doctor is None:
            raise HTTPException(status_code=404, detail="Doctor not found")
        gabinet = db.query(GabinetTable).filter(GabinetTable.id_gabinet == doctor.gabinet_id).first()
        if gabinet is None:
            raise HTTPException(status_code=404, detail="Gabinet not found")
        return {
            "email": user.email,
            "imie": doctor.imie, 
            "nazwisko": doctor.nazwisko,
            "specjalnosc": doctor.specjalnosc,
            "numer_telefonu": doctor.numer_telefonu,
            "gabinet_nazwa": gabinet.nazwa,
            "gabinet_opis": gabinet.opis
        }
    
@app.get("/profile/pacjent")
async def read_about_me_patient(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid authentication credentials")
    user = get_user(db, email=token_data.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.typ_uzytkownika != 'Pacjent':
        raise HTTPException(status_code=401, detail="Unauthorized to access patient profile")

    patient = db.query(PacjentTable).filter(PacjentTable.id_uzytkownik == user.id_uzytkownik).first()
    if patient is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    return {
        "email": user.email,
        "id": patient.id_pacjent,
        "imie": patient.imie,
        "nazwisko": patient.nazwisko,
        "pesel": patient.pesel,
        "data_urodzenia": patient.data_urodzenia,
        "adres": patient.adres,
        "numer_tel": patient.numer_tel
    }

@app.get("/profile/lekarz")
async def read_about_me_lekarz(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=400, detail="Invalid authentication credentials")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=400, detail="Invalid authentication credentials")
    user = get_user(db, email=token_data.email)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    if user.typ_uzytkownika != 'Lekarz':
        raise HTTPException(status_code=401, detail="Unauthorized to access doctor profile")

    doctor = db.query(LekarzTable).filter(LekarzTable.id_uzytkownik == user.id_uzytkownik).first()
    if doctor is None:
        raise HTTPException(status_code=404, detail="Doctor not found")

    gabinet = db.query(GabinetTable).filter(GabinetTable.id_gabinet == doctor.gabinet_id).first()
    if gabinet is None:
        raise HTTPException(status_code=404, detail="Gabinet not found")

    return { 
        "email": user.email,
        "id": doctor.id_lekarz,
        "imie": doctor.imie,
        "nazwisko": doctor.nazwisko,
        "specjalnosc": doctor.specjalnosc,
        "numer_telefonu": doctor.numer_telefonu,
        "gabinet_nazwa": gabinet.nazwa,
        "gabinet_opis": gabinet.opis
    }


@app.post("/user/{id}", response_model=AboutMe)
async def get_user_data(id: int, db: Session = Depends(get_db)):
    user = db.query(models.UserTable).filter_by(id_uzytkownik=id).first()

    if user is None:
        raise HTTPException(status_code=404, detail="Użytkownik nie znaleziony")

    if user.typ_uzytkownika == "Pacjent":
        patient = db.query(models.PacjentTable).filter_by(id_uzytkownik=id).first()

        data = AboutMe(
            email=user.email,
            imie=patient.imie,
            nazwisko=patient.nazwisko,
            pesel=patient.pesel,
            data_urodzenia=patient.data_urodzenia,
            adres=patient.adres,
            numer_tel=patient.numer_tel,
        )

    elif user.typ_uzytkownika == "Lekarz":
        doctor = db.query(models.LekarzTable).filter_by(id_uzytkownik=id).first()

        data = AboutMe(
            email=user.email,
            imie=doctor.imie,
            nazwisko=doctor.nazwisko,
            specjalnosc=doctor.specjalnosc,
            numer_telefonu=doctor.numer_telefonu,
            gabinet_nazwa=doctor.gabinet_nazwa,
            gabinet_opis=doctor.gabinet_opis,
        )

    else:
        raise HTTPException(status_code=400, detail="Nieprawidłowy typ użytkownika")

    return data

@app.post("/pacjent/edit/{id}")
async def edit_patient(id: int, patient_data: EditPatientRequest, db: Session = Depends(get_db)):
    db_patient = db.query(models.PacjentTable).filter(models.PacjentTable.id_pacjent == id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Pacjent nie znaleziony")
    db_patient.imie = patient_data.imie
    db_patient.pesel = patient_data.pesel
    db_patient.nazwisko = patient_data.nazwisko
    db_patient.adres = patient_data.adres
    db_patient.numer_tel = patient_data.numer_tel
    db.commit()
    return {"message": "Pacjent zaktualizowany pomyślnie"}

class EditDoctorRequest(BaseModel):
    imie: str
    nazwisko: str
    specjalnosc: str
    numer_tel: str

@app.post("/lekarz/edit/{id}")
async def edit_patient(id: int, doctor_data: EditDoctorRequest, db: Session = Depends(get_db)):
    db_doctor = db.query(models.LekarzTable).filter(models.LekarzTable.id_lekarz == id).first()
    if db_doctor is None:
        raise HTTPException(status_code=404, detail="Lekarz nie znaleziony")
    db_doctor.imie = doctor_data.imie
    db_doctor.nazwisko = doctor_data.nazwisko
    db_doctor.specjalnosc = doctor_data.specjalnosc
    db_doctor.numer_telefonu = doctor_data.numer_tel
    db.commit()
    return {"message": "Lekarz zaktualizowany pomyślnie"}

@app.delete("/delete/{id}")
async def delete_patient(id: int, db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    if current_user.typ_uzytkownika != 'Lekarz':
        raise HTTPException(status_code=403, detail="Nie masz uprawnień do wykonania tej operacji")
    db_patient = db.query(models.PacjentTable).filter(models.PacjentTable.id_pacjent == id).first()
    if db_patient is None:
        raise HTTPException(status_code=404, detail="Pacjent nie znaleziony")
    db_user = db.query(models.UserTable).filter(models.UserTable.id_uzytkownik == db_patient.id_uzytkownik).first()
    db.delete(db_patient)
    db.delete(db_user)
    db.commit()
    return {"message": "Pacjent usunięty pomyślnie"}

@app.post("/selectpatient/")
async def select_patient(db: Session = Depends(get_db), current_user: UserInDB = Depends(get_current_user)):
    if current_user.typ_uzytkownika != 'Lekarz':
        raise HTTPException(status_code=403, detail="Nie masz uprawnień do wykonania tej operacji")
    db_patients = db.query(models.PacjentTable).all()
    patients = []
    for db_patient in db_patients:
        patients.append({
            "id_pacjent": db_patient.id_pacjent,
            "imie": db_patient.imie,
            "pesel": db_patient.pesel,
            "nazwisko": db_patient.nazwisko,
            "data_urodzenia": db_patient.data_urodzenia,
            "adres": db_patient.adres,
            "numer_tel": db_patient.numer_tel
        })
    return patients

@app.post("/selectpatient2/")
async def select_patient(db: Session = Depends(get_db)):
    db_patients = db.query(PacjentTable).all()
    patients = []
    for db_patient in db_patients:
        patients.append({
            "id_pacjent": db_patient.id_pacjent,
            "imie": db_patient.imie,
            "pesel": db_patient.pesel,
            "nazwisko": db_patient.nazwisko,
            "data_urodzenia": db_patient.data_urodzenia,
            "adres": db_patient.adres,
            "numer_tel": db_patient.numer_tel
        })
    return patients

@app.post("/select/doctors")
async def select_doctors(db: Session = Depends(get_db)):
    db_doctors = db.query(LekarzTable).all()
    doctors = []
    for db_doctor in db_doctors:
        doctors.append({
            "id": db_doctor.id_lekarz,
            "imie": db_doctor.imie,
            "nazwisko": db_doctor.nazwisko,
        })
    return doctors

@app.post("/select/services")
async def select_doctors(db: Session = Depends(get_db)):
    db_services = db.query(UslugaTable).all()
    services = []
    for db_service in db_services:
        services.append({
            "id": db_service.id_uslugi,
            "nazwa": db_service.nazwa,
            "cena": db_service.cena,
            "opis": db_service.opis
        })
    return services

class CreateAppointmentRequest(BaseModel):
    doctorId: int
    appointmentDate: datetime.date
    appointmentTime: str
    IdPatient: int
    services: list[int]

@app.post('/create/appointment')
async def create_appointment(appointment_data: CreateAppointmentRequest,db: Session = Depends(get_db)):
        # Retrieve the cabinet name for the specified doctor
    lekarz_id = appointment_data.doctorId
    cabinet_name = select(GabinetTable.nazwa).where(GabinetTable.id_gabinet == LekarzTable.gabinet_id).where(LekarzTable.id_lekarz == lekarz_id)

    # Retrieve all services for the appointment
    services = db.query(UslugaTable).filter(UslugaTable.id_uslugi.in_(appointment_data.services)).all()

    # Calculate the total price of the services
    total_price = 0
    for service in services:
        total_price += service.cena

    appointment = WizytaTable(
        pacjent_id=appointment_data.IdPatient,
        lekarz_id=appointment_data.doctorId,
        gabinet=cabinet_name,
        godzina=appointment_data.appointmentTime,
        data_wizyta=appointment_data.appointmentDate,
        data_utworzenia=datetime.datetime.utcnow(),
        status="Zaplanowana",
        cena=total_price
        )
    
    # Check if the appointment time and date are already taken
    existing_appointments = db.query(WizytaTable).filter(
        WizytaTable.godzina == appointment.godzina,
        WizytaTable.data_wizyta == appointment.data_wizyta
    ).all()

    if existing_appointments:
        return {
            "message": "Appointment time and date are already taken"
        }


    db.add(appointment)
    db.commit()

    # Create the prescription
    prescription = ReceptaTable(
        wizyta_id=appointment.id_wizyta,
        lekarz_id=appointment.lekarz_id,
        data_wystawienia=datetime.datetime.now(),
        data_waznosci=datetime.datetime.now() + datetime.timedelta(days=365),
        nazwa_leku="Brak",
        dawka="Brak",
        liczba_dawek=0,
    )
    # Add the prescription to the database
    db.add(prescription)
    db.commit()

    for service_id in appointment_data.services:
        service = db.get(UslugaTable, service_id)

        wizyta_usluga = WizytaUslugaTable(wizyta_id=appointment.id_wizyta, usluga_id=service.id_uslugi)
        db.add(wizyta_usluga)
        db.commit()

    return 'pomyslnie'

#@app.post("/selectwizyty/")
#async def select_wizyty(db: Session = Depends(get_db), current_user: models.UserTable = Depends(get_current_user)):
 #   if current_user.typ_uzytkownika != 'Lekarz':
  #      raise HTTPException(status_code=403, detail="Access denied")
   # db_wizyty = db.query(models.WizytaTable).all()

@app.get("/selectwizyty/")
async def select_wizyty(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    if current_user.typ_uzytkownika != "Lekarz":
        raise HTTPException(status_code=401, detail="Unauthorized to access patient profile")
    db_wizyty = db.query(models.WizytaTable).all()
    wizyty = []
    for db_wizyta in db_wizyty:
        pacjent = db.query(models.PacjentTable).filter(models.PacjentTable.id_pacjent == db_wizyta.pacjent_id).first()
        lekarz = db.query(models.LekarzTable).filter(models.LekarzTable.id_lekarz == db_wizyta.lekarz_id).first()
        uslugi = []
        for wizyta_usluga in db.query(models.WizytaUslugaTable).filter(models.WizytaUslugaTable.wizyta_id == db_wizyta.id_wizyta):
            uslugi.append(db.query(models.UslugaTable).filter(models.UslugaTable.id_uslugi == wizyta_usluga.usluga_id).first().nazwa)
        wizyty.append({
            "id_wizyta": db_wizyta.id_wizyta,
            "gabinet": db_wizyta.gabinet,
            "pacjent_id": db_wizyta.pacjent_id,
            "lekarz_id": db_wizyta.lekarz_id,
            "godzina": db_wizyta.godzina,
            "data_wizyta": db_wizyta.data_wizyta,
            "cena": db_wizyta.cena,
            "data_utworzenia": db_wizyta.data_utworzenia,
            "diagnoza": db_wizyta.diagnoza,
            "status": db_wizyta.status,
            "pacjent_imie": pacjent.imie,
            "pacjent_nazwisko": pacjent.nazwisko,
            "lekarz_imie": lekarz.imie,
            "lekarz_nazwisko": lekarz.nazwisko,
            "uslugi": uslugi
        })
    return wizyty

@app.post("/selectwizyta/{id}")
async def select_wizyta(id: int, db: Session = Depends(get_db)):
    db_wizyta = db.query(models.WizytaTable).filter(models.WizytaTable.id_wizyta == id).first()

    if db_wizyta is None:
        return {"message": "Wizyta nie istnieje"}

    pacjent = db.query(models.PacjentTable).filter(models.PacjentTable.id_pacjent == db_wizyta.pacjent_id).first()
    lekarz = db.query(models.LekarzTable).filter(models.LekarzTable.id_lekarz == db_wizyta.lekarz_id).first()
    uslugi = []
    for wizyta_usluga in db.query(models.WizytaUslugaTable).filter(models.WizytaUslugaTable.wizyta_id == db_wizyta.id_wizyta):
        uslugi.append(db.query(models.UslugaTable).filter(models.UslugaTable.id_uslugi == wizyta_usluga.usluga_id).first().nazwa)

    return {
        "id_wizyta": db_wizyta.id_wizyta,
        "gabinet": db_wizyta.gabinet,
        "pacjent_id": db_wizyta.pacjent_id,
        "lekarz_id": db_wizyta.lekarz_id,
        "godzina": db_wizyta.godzina,
        "data_wizyta": db_wizyta.data_wizyta,
        "cena": db_wizyta.cena,
        "data_utworzenia": db_wizyta.data_utworzenia,
        "diagnoza": db_wizyta.diagnoza,
        "status": db_wizyta.status,
        "pacjent_imie": pacjent.imie,
        "pacjent_nazwisko": pacjent.nazwisko,
        "lekarz_imie": lekarz.imie,
        "lekarz_nazwisko": lekarz.nazwisko,
        "uslugi": uslugi,
    }

class EditWizytaRequest(BaseModel):
    godzina: str
    data_wizyta: str
    diagnoza: str
    status: str

@app.post("/wizyty/edit/{id}")
async def edit_wizyta(id: int, wizyta_data: EditWizytaRequest, db: Session = Depends(get_db)):
  db_wizyta = db.query(models.WizytaTable).filter(models.WizytaTable.id_wizyta == id).first()
  if db_wizyta is None:
    raise HTTPException(status_code=404, detail="Wizyta nie znaleziona")
  
  existing_appointments = db.query(WizytaTable).filter(
        WizytaTable.godzina == wizyta_data.godzina,
        WizytaTable.data_wizyta == wizyta_data.data_wizyta,
        WizytaTable.id_wizyta != id
       
    ).all()

  if existing_appointments:
        return {
            "message": "Appointment time and date are already taken"
        }  
  
  db_wizyta.godzina = wizyta_data.godzina
  db_wizyta.data_wizyta = wizyta_data.data_wizyta
  db_wizyta.diagnoza = wizyta_data.diagnoza
  db_wizyta.status = wizyta_data.status
  db.commit()
  return {"message": "Wizyta zaktualizowana pomyślnie"}

class CreateReceptaRequest(BaseModel):
    wizyta_id:int
    lekarz_id:int
    nazwa_leku:str
    dawka:str
    liczba_dawek:int

@app.post("/Create/Recepta")
async def create_recepta(recepta: CreateReceptaRequest, db: Session = Depends(get_db)):
    recepty = db.query(models.ReceptaTable).filter(models.ReceptaTable.wizyta_id == recepta.wizyta_id).all()
    if recepty:
        raise HTTPException(status_code=409, detail="Recepta o tym samym ID wizyty już istnieje.")

    data_waznosci = datetime.datetime.now() + datetime.timedelta(days=365)
    
    recepta_data = models.ReceptaTable(
        wizyta_id=recepta.wizyta_id,
        lekarz_id=recepta.lekarz_id,
        data_wystawienia=datetime.datetime.now(),
        data_waznosci=data_waznosci,
        nazwa_leku=recepta.nazwa_leku,
        dawka=recepta.dawka,
        liczba_dawek=recepta.liczba_dawek,
    )
    db.add(recepta_data)
    db.commit()
    return {"message": "Recepta utworzona pomyślnie"}

@app.post("/Select/Recepta/{id}")
async def select_recepta(id: int, db: Session = Depends(get_db)):
    recepta = db.query(models.ReceptaTable).filter(models.ReceptaTable.wizyta_id == id).first()
    if not recepta:
        raise HTTPException(status_code=404, detail="Recepta o podanym ID nie istnieje.")

    lekarz = db.query(models.LekarzTable).filter(models.LekarzTable.id_lekarz == recepta.lekarz_id).first()
    return {
        "id": recepta.id_recepta,
        "wizyta_id": recepta.wizyta_id,
        "lekarz_id": lekarz.imie + " " + lekarz.nazwisko,
        "data_wystawienia": recepta.data_wystawienia,
        "data_waznosci": recepta.data_waznosci,
        "nazwa_leku": recepta.nazwa_leku,
        "dawka": recepta.dawka,
        "liczba_dawek": recepta.liczba_dawek,
    }

class EditReceptaRequest(BaseModel):
    nazwa_leku:str
    dawka:str
    liczba_dawek:int

@app.post("/recepta/edit/{id}")
async def edit_recepta(id: int, recepta_data: EditReceptaRequest, db: Session = Depends(get_db)):
  db_recepta = db.query(models.ReceptaTable).filter(models.ReceptaTable.id_recepta == id).first()
  if db_recepta is None:
    raise HTTPException(status_code=404, detail="Recepta nie znaleziona")
  
  db_recepta.nazwa_leku = recepta_data.nazwa_leku
  db_recepta.dawka = recepta_data.dawka
  db_recepta.liczba_dawek = recepta_data.liczba_dawek
  db.commit()
  return {"message": "Wizyta zaktualizowana pomyślnie"}



@app.get("/wizyty/pacjent")
async def select_wizyty_pacjent(current_user: User = Depends(get_current_user),db: Session = Depends(get_db)):
    print(current_user.id_uzytkownik, current_user.typ_uzytkownika)
    if current_user.typ_uzytkownika != "Pacjent":
        raise HTTPException(status_code=401, detail="Unauthorized to access patient profile")

    pacjent = db.query(models.PacjentTable).filter(models.PacjentTable.id_uzytkownik == current_user.id_uzytkownik).first()
    if pacjent is None:
        raise HTTPException(status_code=404, detail="Patient not found")

    db_wizyty = db.query(models.WizytaTable).filter(models.WizytaTable.pacjent_id == pacjent.id_pacjent).all()
    wizyty = []
    for db_wizyta in db_wizyty:
        pacjent = db.query(models.PacjentTable).filter(models.PacjentTable.id_pacjent == db_wizyta.pacjent_id).first()
        lekarz = db.query(models.LekarzTable).filter(models.LekarzTable.id_lekarz == db_wizyta.lekarz_id).first()
        uslugi = []
        for wizyta_usluga in db.query(models.WizytaUslugaTable).filter(models.WizytaUslugaTable.wizyta_id == db_wizyta.id_wizyta):
            uslugi.append(db.query(models.UslugaTable).filter(models.UslugaTable.id_uslugi == wizyta_usluga.usluga_id).first().nazwa)
        wizyty.append({
            "id_wizyta": db_wizyta.id_wizyta,
            "gabinet": db_wizyta.gabinet,
            "pacjent_id": db_wizyta.pacjent_id,
            "lekarz_id": db_wizyta.lekarz_id,
            "godzina": db_wizyta.godzina,
            "data_wizyta": db_wizyta.data_wizyta,
            "cena": db_wizyta.cena,
            "data_utworzenia": db_wizyta.data_utworzenia,
            "diagnoza": db_wizyta.diagnoza,
            "status": db_wizyta.status,
            "pacjent_imie": pacjent.imie,
            "pacjent_nazwisko": pacjent.nazwisko,
            "lekarz_imie": lekarz.imie,
            "lekarz_nazwisko": lekarz.nazwisko,
            "uslugi": uslugi
        })
    return wizyty


@app.post("/select/wizyty/pacjent2/")
async def select_wizyty_pacjent(token: str = Depends(oauth2_scheme),db: Session = Depends(get_db),
):
    current_user = get_current_user(db=db, token=token)
    if not current_user:
        raise HTTPException(status_code=401, detail="Nieautoryzowany dostęp")

    pacjent_id = current_user.id_uzytkownik
    db_wizyty = db.query(models.WizytaTable).filter(models.WizytaTable.pacjent_id == pacjent_id).all()
    wizyty = []
    for db_wizyta in db_wizyty:
        wizyty.append({
            "id_wizyta": db_wizyta.id_wizyta,
            "gabinet": db_wizyta.gabinet,
            "pacjent_id": db_wizyta.pacjent_id,
            "lekarz_id": db_wizyta.lekarz_id,
            "godzina": db_wizyta.godzina,
            "data_wizyta": db_wizyta.data_wizyta,
            "cena": db_wizyta.cena,
            "data_utworzenia": db_wizyta.data_utworzenia,
            "diagnoza": db_wizyta.diagnoza,
            "status": db_wizyta.status,
        })
    return wizyty
