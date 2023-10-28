import axios from 'axios';

async function buscarAlelosGen(gen) {
  try {
    const response = await axios.get(`https://api.cpicpgx.org/v1/allele?genesymbol=eq.${gen}`);
    return Array.from(new Set(response.data.map(item => item.name))).sort();
  } catch (error) {
    console.error('Error al buscar alelos del gen:', error);
    throw new Error('Error al buscar alelos del gen');
  }
}

async function ID_CPIC_Farmaco(nombreFarmaco) {
  try {
    const response = await axios.get(`https://api.cpicpgx.org/v1/drug?name=eq.${nombreFarmaco}`);
    return response.data.length > 0 ? response.data[0].drugid : '';
  } catch (error) {
    console.error('Error al buscar el ID del fármaco:', error);
    throw new Error('Error al buscar el ID del fármaco');
  }
}

async function fenotipoSegunAlelos(gen, alelo1, alelo2) {
  try {
    const response = await axios.get(`https://api.cpicpgx.org/v1/diplotype?genesymbol=eq.${gen}&diplotype=eq.${alelo1}/${alelo2}`);
    return response.data;
  } catch (error) {
    console.error('Error al buscar fenotipo según alelos:', error);
    throw new Error('Error al buscar fenotipo según alelos');
  }
}

async function urlGuia(farmaco) {
  try {
    const response = await axios.get(`https://api.cpicpgx.org/v1/drug?name=eq.${farmaco}&select=guideline_for_drug(*)`);
    return response.data.length > 0 && response.data[0].guideline_for_drug ? response.data[0].guideline_for_drug.url : '';
  } catch (error) {
    console.error('Error al buscar la URL de la guía:', error);
    throw new Error('Error al buscar la URL de la guía');
  }
}

async function recomendacionClinica(gen, alelo1, alelo2, farmaco) {
  try {
    const fenotipo = await fenotipoSegunAlelos(gen, alelo1, alelo2);
    if (fenotipo.length > 0) {
      const lookupkey = fenotipo[0].lookupkey;
      const ID_Farmaco = await ID_CPIC_Farmaco(farmaco);
      const response = await axios.get(`https://api.cpicpgx.org/v1/recommendation?select=drug(name), guideline(name), * &drugid=eq.${ID_Farmaco}&lookupkey=cs.${JSON.stringify(lookupkey)}`);
      if (response.data.length > 0) {
        const guiaURL = await urlGuia(farmaco);
        return [
          fenotipo[0].generesult,
          response.data[0].drugrecommendation,
          response.data[0].guideline.name,
          guiaURL
        ];
      }
    }
    return [];
  } catch (error) {
    console.error('Error al buscar recomendación clínica:', error);
    throw new Error('Error al buscar recomendación clínica');
  }
}



export {
  buscarAlelosGen,
  ID_CPIC_Farmaco,
  fenotipoSegunAlelos,
  urlGuia,
  recomendacionClinica,
};
