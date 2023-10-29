import React, { useState, useEffect } from 'react';
import './App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
import jsPDF from 'jspdf';
import axios from 'axios';

import {
  buscarAlelosGen,
  ID_CPIC_Farmaco,
  fenotipoSegunAlelos,
  urlGuia,
  recomendacionClinica,
} from './api';

function App() {
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
    alelo2: ''
  });

  const [resultadosData, setResultadosData] = useState({
    Genotype: '',
    Phenotype: '',
    Population: '',
    Implications: '',
    Recommendation: '',
    OtherConsiderations: '',
    Classification: ''
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/pacientes/', formData);
      console.log('Formulario enviado con éxito', response.data);
      // Aquí puedes manejar la respuesta del servidor
    } catch (error) {
      console.error('Error al enviar el formulario', error);
      // Aquí puedes manejar el error
    }
  };

  useEffect(() => {
    const fetchAlelos = async () => {
      try {
        const alelosGen = await buscarAlelosGen('CYP2C19');
        // setAlelos(alelosGen); // If needed
      } catch (error) {
        console.error('Error al obtener los alelos:', error);
      }
    };

    fetchAlelos();
  }, []);

  const obtenerResultados = async () => {
    try {
      setIsLoading(true);
      const {
        genotipos,
        alelo1,
        alelo2,
        tratamiento,
      } = formData;

      const resultadosGenotipo = await buscarAlelosGen(genotipos);
      const resultadosRecomendaciones = await recomendacionClinica(genotipos, alelo1, alelo2, tratamiento);
      const farmacoCPIC = await ID_CPIC_Farmaco(tratamiento);
      const fenotipo = await fenotipoSegunAlelos(alelo1, alelo2);
      const guia = await urlGuia(farmacoCPIC);

      setResultadosData({
        Genotype: resultadosGenotipo,
        Recommendation: resultadosRecomendaciones,
        ID_CPIC_Farmaco: farmacoCPIC,
        Fenotipo: fenotipo,
        Guia: guia,
      });

      setMostrarResultados(true);
    } catch (error) {
      console.error('Error al obtener los resultados:', error);
      setError('Ocurrió un error al obtener los resultados. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const validarEntrada = (formData) => {
    console.log(formData);
    const camposRequeridos = [
      'Ndehistoriaclinica',
      'nombre',
      'apellido',
      'genero',
      'Fechadenacimiento',
      'Enfermedad',
      'tratamiento',
      'genotipos',
      'alelo1',
      'alelo2',
    ];
  
    const camposVacios = camposRequeridos.filter(campo => !formData[campo]);
  
    if (camposVacios.length > 0) {
      console.log('Campos vacíos:', camposVacios);
      return false;
    }
  
    return true;
  };
  

  
  const handleDownloadPDF = () => {
    if (!validarEntrada(formData)) {
      setError('Por favor, completa los campos requeridos antes de descargar el PDF.');
      return;
    }
    
    setError(null);
  
    // Estructuración de la información del paciente y resultados para el PDF
    const pacienteInfo = {
      'Nº Historia clínica': formData.Ndehistoriaclinica,
      'Nombre': formData.nombre,
      'Apellido': formData.apellido,
      'Género': formData.genero,
      'Fecha de nacimiento': formData.Fechadenacimiento,
      'Enfermedad Actual': formData.Enfermedad,
      'Otras Enfermedades': formData.otrasenfermedades,
      'Tratamiento habitual': formData.tratamiento,
      'Genotipos': formData.genotipos,
      'Alelo 1': formData.alelo1,
      'Alelo 2': formData.alelo2,
      ...resultadosData,
    };
  
    // Creación del PDF
    const pdf = new jsPDF();
    let content = 'Información del paciente y resultados:\n\n';
    Object.entries(pacienteInfo).forEach(([key, value]) => {
      content += `${key}: ${value || 'No disponible'}\n`;
    });
  
    // Añadir el contenido al PDF
    pdf.text(content, 10, 10);
    pdf.save('informe.pdf');
  };

  return (
    <div className="App">
      <Navbar />
      <div className="Todo">
        <div className="main-content">
          <div className="row">
            <div className="column">
              <Main formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
            </div>
            <div className="column column-center">
              <div className="buttons-container">
                <button type="button" onClick={obtenerResultados} disabled={isLoading}>Mostrar Resultados</button>
                <button type="button" onClick={handleDownloadPDF} disabled={isLoading}>Descargar PDF</button>
              </div>
              {isLoading && <p>Cargando...</p>}
              {error && <p className="error-message">{error}</p>}
            </div>
            {mostrarResultados && (
              <div className="column resultado-column">
                <div className="resultado-container">
                  <h2>RESULTADO</h2>
                  <div className="result-details">
                    <p className="result-section"><strong>Genotipo:</strong> {resultadosData.Genotype || 'No disponible'}</p>
                    <p className="result-section"><strong>Fenotipo:</strong> {resultadosData.Phenotype || 'No disponible'}</p>
                    <p className="result-section"><strong>Populación:</strong> {resultadosData.Population || 'No disponible'}</p>
                    <p className="result-section"><strong>Implicaciones:</strong> {resultadosData.Implications || 'No disponible'}</p>
                    <p className="result-section"><strong>Recomendación:</strong> {resultadosData.Recommendation || 'No disponible'}</p>
                    <p className="result-section"><strong>Otras Consideraciones:</strong> {resultadosData.OtherConsiderations || 'No disponible'}</p>
                    <p className="result-section"><strong>Clasificación:</strong> {resultadosData.Classification || 'No disponible'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
