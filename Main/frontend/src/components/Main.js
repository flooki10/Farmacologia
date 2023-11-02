import React, { useState } from 'react';
import jsPDF from 'jspdf';
import './Main.css';

// Define the main functional component
const Main = () => {
  // State to manage form data
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

  // State to store API results, loading status, and drug recommendations
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [setDrugRecommendations] = useState([]);

  // Generate alelo options for dropdowns
  const aleloOptions = Array.from({ length: 39 }, (_, index) => `${index + 1}*`);

  // Handle input changes in the form
  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
  

  // Handle form submission (no logic implemented currently)
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add any form submission logic here if needed
  };

  // Validate the form to ensure all required fields are filled
  const validateForm = () => {
    return Object.values(formData).every((value) => value.trim() !== '');
  };

  // Fetch and display drug recommendations based on user input
  const handleGenerateResults = async () => {
    if (Object.values(formData).some((value) => value.trim() === '')) {
      alert('Please fill in all the required fields');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch drug information to get drugid
      const drugInfoResponse = await fetch(`https://api.cpicpgx.org/v1/drug?name=eq.${encodeURIComponent(formData.tratamiento.toLowerCase())}`);
      
      // Check if the response status is OK (200)
      if (drugInfoResponse.ok) {
        const drugInfoData = await drugInfoResponse.json();

        if (drugInfoData.length > 0) {
          const drugId = drugInfoData[0].drugid;

          // Fetch drug recommendations based on drugid
          const recommendationResponse = await fetch(`https://api.cpicpgx.org/v1/recommendation?drugid=eq.${encodeURIComponent(drugId)}`);
          
          // Check if the response status is OK (200)
          if (recommendationResponse.ok) {
            const recommendationData = await recommendationResponse.json();

            if (recommendationData.length > 0) {
              // Initialize resultData array
              const resultData = recommendationData.map((item) => ({
                label: 'Recommendation',
                value: item.drugrecommendation,
                implications: item.implications?.CYP2C19 || 'Not available',
                phenotypes: item.phenotypes?.CYP2C19 || 'Not available',
                classification: item.classification || 'Not available',
                population: item.population || 'Not available',
              }));

              // Set the results state
              setResults(resultData);

              // Set drug recommendations state
              setDrugRecommendations(recommendationData);
            }
          } else {
            console.error('Failed to fetch drug recommendations:', recommendationResponse.status);
          }
        }
      } else {
        console.error('Failed to fetch drug information:', drugInfoResponse.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setIsLoading(false);
  };
  
  // Generate and download a PDF with patient information and results

  const addDataToPDF = (pdf, data, startY) => {
    data.forEach(({ label, value }, index) => {
      pdf.text(`${label}: ${value}`, 20, startY + index * 10);
    });
  };

  const handleDownloadPDF = () => {
    if (!validateForm()) {
      alert('Please fill in all the required fields');
      return;
    }

    setIsLoading(true);

    const pdf = new jsPDF();
    pdf.text('Información del paciente y resultados:\n\n', 20, 10);

    addDataToPDF(pdf, Object.entries(formData), 20);
    addDataToPDF(pdf, results, 20 + Object.keys(formData).length * 10);

    pdf.save('informe.pdf');
    setIsLoading(false);
  };

// Render the main component

  return (
    <div className="Todo">
      <div className="main-content">
        <div className="row">
          <div className="column">
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
                    <option value="">Seleccione una opción</option>
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
                    value={formData.Fechadenacimiento}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="Enfermedad">Enfermedad Actual</label>
                  <input
                    type="text"
                    id="Enfermedad"
                    name="Enfermedad"
                    placeholder="Enfermedad Actual"
                    value={formData.Enfermedad}
                    onChange={handleInputChange}
                    required
                  />
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
                    required
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
                    <option value="clopidogrel">clopidogrel</option>
                    <option value="simvastatina">simvastatina</option>
                    <option value="atorvastatina">storvastatina</option>
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
                      {aleloOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
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
                      {aleloOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Button and Loading Section */}
          <div className="column column-center">
            <div className="buttons-container">
              <button type="button" onClick={handleGenerateResults} disabled={isLoading}>
                Mostrar Resultados
              </button>
              <button type="button" onClick={handleDownloadPDF} disabled={isLoading}>
                Descargar PDF
              </button>
            </div>
            {isLoading && <p>Cargando...</p>}
          </div>

          {/* Results Section */}
          <div className="column">
            {results.length > 0 && (
            <div className="column resultado-column">
            {results.length > 0 && (
              <div className="resultado-container">
                <h2>RESULTADO</h2>
                <div className="result-details">
                  <p className="result-section"><strong>Nº Historia clínica:</strong> {formData.Ndehistoriaclinica}</p>
                  <p className="result-section"><strong>Nombre:</strong> {formData.nombre}</p>
                  <p className="result-section"><strong>Apellido:</strong> {formData.apellido}</p>
                  <p className="result-section"><strong>Género:</strong> {formData.genero}</p>
                  <p className="result-section"><strong>Fecha de nacimiento:</strong> {formData.Fechadenacimiento}</p>
                  <p className="result-section"><strong>Enfermedad Actual:</strong> {formData.Enfermedad}</p>
                  <p className="result-section"><strong>Otras Enfermedades:</strong> {formData.otrasenfermedades}</p>
                  <p className="result-section"><strong>Tratamiento habitual:</strong> {formData.tratamiento}</p>
                  <p className="result-section"><strong>Genotipos:</strong> {formData.genotipos}</p>
                  <p className="result-section"><strong>Alelo 1:</strong> {formData.alelo1}</p>
                  <p className="result-section"><strong>Alelo 2:</strong> {formData.alelo2}</p>
                  <br></br>

                  {results.map((result, index) => (
                    <React.Fragment key={index}>
                      <p className="result-section"><strong>Genotipo:</strong> {result.implications || 'No disponible'}</p>
                      <p className="result-section"><strong>Fenotipo:</strong> {result.phenotypes || 'No disponible'}</p>
                      <p className="result-section"><strong>Populación:</strong> {result.population || 'No disponible'}</p>
                      <p className="result-section"><strong>Implicaciones:</strong> {result.implications || 'No disponible'}</p>
                      <p className="result-section"><strong>Recomendación:</strong> {result.drugRecommendations || 'No disponible'}</p>
                      <p className="result-section"><strong>classification:</strong> {result.classification || 'No disponible'}</p>
                      <br></br>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
