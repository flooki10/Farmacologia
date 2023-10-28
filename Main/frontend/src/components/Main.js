import React, { useState} from 'react';
import './Main.css';
import axios from 'axios';



function Main() {

  const [formData, setFormData] = useState({
    Ndehistoriaclinica: '',
    nombre: '',
    apellido: '',
    genero: '',
    Fechadenacimiento: '',
    Enfermedad: '',
    otrasenfermedades: '',
    tratamiento: '',
    genotipos: '',
    alelo1: '',
    alelo2: '',
  });

  const [resultados, setResultados] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Previene la recarga de la página al enviar el formulario
    axios
      .post('http://localhost:8000/api/pacientes/', formData)
      .then((res) => {
        setResultados(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    
  };


  return (
    <div className="patient-info-form">
      <h2>Información del Paciente</h2>

      <form onSubmit={handleSubmit}>

        <div className="form-group">
            <label htmlFor="Ndehistoriaclinica">Nº Historia clínica</label>
            <input
              type="number"
              id="Ndehistoriaclinica"
              name="Ndehistoriaclinica"
              placeholder="Nº de la historia clinica"
              value={formData.Ndehistoriaclinica}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Nombre del Paciente"
              value={formData.nombre}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="apellido">Apellido</label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              placeholder="Apellido del Paciente"
              value={formData.apellido}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="genero">Género</label>
            <select
              id="genero"
              name="genero"
              value={formData.genero}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccionar Género</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="Fechadenacimiento">Fecha de nacimiento</label>
            <input
              type="date"
              id="Fechadenacimiento"
              name="Fechadenacimiento"
              placeholder="Fechadenacimiento"
              value={formData.Fechadenacimiento}
              onChange={handleInputChange}
              required
            />
          </div>


          <div className="form-group">
            <label htmlFor="Enfermedad">Enfermedad Actual</label>
            <select
              id="Enfermedad"
              name="Enfermedad"
              value={formData.Enfermedad}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona la enfermedad</option>
              <option value="Cardiovascular">Cardiovascular</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="otrasenfermedades">Otras Enfermedades</label>
            <input
              type="text"
              id="otrasenfermedades"
              name="otrasenfermedades"
              placeholder="Otras Enfermedades"
              value={formData.otrasenfermedades}
              onChange={handleInputChange}
              
            />
          </div>

          <div className="form-group">
            <label htmlFor="tratamiento">Tratamiento habitual</label>
            <select
              id="tratamiento"
              name="tratamiento"
              value={formData.tratamiento}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona el tratamiento</option>
              <option value="Clopidogrel">Clopidogrel</option>
              <option value="Simvastatina">Simvastatina</option>
              <option value="Atorvastatina">Atorvastatina</option>
            </select>
          </div>


          <div className="form-group">
            <label htmlFor="genotipos">Genotipos</label>
            <select
              id="genotipos"
              name="genotipos"
              value={formData.genotipos}
              onChange={handleInputChange}
              required
            >
              <option value="">Selecciona un Genotipo</option>
              <option value="CYP2C19">CYP2C19</option>
              <option value="SLCO1B1">SLCO1B1</option>
            </select>
          </div>

          <div className="form-container">
          <div className="form-group">
            <label htmlFor="alelo1">Alelo 1:</label>
            <select
              id="alelo1"
              name="alelo1"
              value={formData.alelo1}
              onChange={handleInputChange}
              required
            >
              <option value="">--</option>
              <option value="1*">1*</option>
              <option value="2*">2*</option>
              <option value="3*">3*</option>
              <option value="4*">4*</option>
              <option value="5*">5*</option>
              <option value="6*">6*</option>
              <option value="7*">7*</option>
              <option value="8*">8*</option>
              <option value="9*">9*</option>
              <option value="10*">10*</option>
              <option value="11*">11*</option>
              <option value="12*">12*</option>
              <option value="13*">13*</option>
              <option value="14*">14*</option>
              <option value="15*">15*</option>
              <option value="16*">16*</option>
              <option value="17*">17*</option>
              <option value="18*">18*</option>
              <option value="19*">19*</option>
              <option value="20*">20*</option>
              <option value="21*">21*</option>
              <option value="22*">22*</option>
              <option value="23*">23*</option>
              <option value="24*">24*</option>
              <option value="25*">25*</option>
              <option value="26*">26*</option>
              <option value="27*">27*</option>
              <option value="28*">28*</option>
              <option value="29*">29*</option>
              <option value="30*">30*</option>
              <option value="31*">31*</option>
              <option value="32*">32*</option>
              <option value="33*">33*</option>
              <option value="34*">34*</option>
              <option value="35*">35*</option>
              <option value="36*">36*</option>
              <option value="37*">37*</option>
              <option value="38*">38*</option>
              <option value="39*">39*</option>
            </select>
            </div>
          
          <div className="form-group">
            <label htmlFor="alelo2">Alelo 2:</label>
            <select
              id="alelo2"
              name="alelo2"
              value={formData.alelo2}
              onChange={handleInputChange}
              required
            >
              <option value="">--</option>
              <option value="1*">1*</option>
              <option value="2*">2*</option>
              <option value="3*">3*</option>
              <option value="4*">4*</option>
              <option value="5*">5*</option>
              <option value="6*">6*</option>
              <option value="7*">7*</option>
              <option value="8*">8*</option>
              <option value="9*">9*</option>
              <option value="10*">10*</option>
              <option value="11*">11*</option>
              <option value="12*">12*</option>
              <option value="13*">13*</option>
              <option value="14*">14*</option>
              <option value="15*">15*</option>
              <option value="16*">16*</option>
              <option value="17*">17*</option>
              <option value="18*">18*</option>
              <option value="19*">19*</option>
              <option value="20*">20*</option>
              <option value="21*">21*</option>
              <option value="22*">22*</option>
              <option value="23*">23*</option>
              <option value="24*">24*</option>
              <option value="25*">25*</option>
              <option value="26*">26*</option>
              <option value="27*">27*</option>
              <option value="28*">28*</option>
              <option value="29*">29*</option>
              <option value="30*">30*</option>
              <option value="31*">31*</option>
              <option value="32*">32*</option>
              <option value="33*">33*</option>
              <option value="34*">34*</option>
              <option value="35*">35*</option>
              <option value="36*">36*</option>
              <option value="37*">37*</option>
              <option value="38*">38*</option>
              <option value="39*">39*</option>
            </select>
          </div>
          </div>
      </form>

    </div>
  );
}

export default Main;

/*<button type="submit">Guardar</button> */