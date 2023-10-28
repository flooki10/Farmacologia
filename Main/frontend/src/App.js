import React, { useState, useEffect } from 'react';
import './App.css';
import Main from './components/Main';
import Navbar from './components/Navbar';
import jsPDF from 'jspdf';

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
    alelo2: '',
  });

  const [resultadosData, setResultadosData] = useState({
    Genotype: '',
    Phenotype: '',
    Population: '',
    Implications: '',
    Recommendation: '',
    OtherConsiderations: '',
    Classification: '',
  });

  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleDownloadPDF = () => {
    console.log("FormData antes de descargar PDF:", formData);

    const {
      Ndehistoriaclinica,
      nombre,
      apellido,
      genero,
      Fechadenacimiento,
      Enfermedad,
      tratamiento,
      genotipos,
      alelo1,
      alelo2,
    } = formData;
  
    const camposRequeridos = [
      { campo: 'Nº Historia clínica', valor: Ndehistoriaclinica },
      { campo: 'Nombre', valor: nombre },
      { campo: 'Apellido', valor: apellido },
      { campo: 'Género', valor: genero },
      { campo: 'Fecha de nacimiento', valor: Fechadenacimiento },
      { campo: 'Enfermedad Actual', valor: Enfermedad },
      { campo: 'Tratamiento habitual', valor: tratamiento },
      { campo: 'Genotipos', valor: genotipos },
    ];
  
    const campoVacio = camposRequeridos.find(c => !c.valor);
    if (campoVacio) {
      alert(`Por favor, completa el campo ${campoVacio.campo} antes de descargar el PDF.`);
      console.log(`Campo vacío: ${campoVacio.campo}`, campoVacio.valor);
      return;
    }
  
    const pacienteInfo = {
      'Nº Historia clínica': Ndehistoriaclinica,
      'Nombre': nombre,
      'Apellido': apellido,
      'Género': genero,
      'Fecha de nacimiento': Fechadenacimiento,
      'Enfermedad Actual': Enfermedad,
      'Tratamiento habitual': tratamiento,
      'Genotipos': genotipos,
      'Alelo 1': alelo1 || 'N/A',
      'Alelo 2': alelo2 || 'N/A',
      ...resultadosData,
    };
  
    const pdf = new jsPDF();
    let content = 'Información del paciente:\n\n';
    Object.entries(pacienteInfo).forEach(([key, value]) => {
      content += `${key}: ${value}\n`;
    });
  
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
              <Main formData={formData} handleInputChange={handleInputChange} />
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
                    <p className="result-section"><strong>Populación:</strong> {resultadosData.Population}</p>
                    <p className="result-section"><strong>Implicaciones:</strong> {resultadosData.Implications}</p>
                    <p className="result-section"><strong>Recomendación:</strong> {resultadosData.Recommendation}</p>
                    <p className="result-section"><strong>Otras Consideraciones:</strong> {resultadosData.OtherConsiderations}</p>
                    <p className="result-section"><strong>Clasificación:</strong> {resultadosData.Classification}</p>
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
