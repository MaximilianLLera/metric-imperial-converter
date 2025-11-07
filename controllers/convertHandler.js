'use strict';

// Tabla con las unidades, sus factores de conversión y nombres completos
const CONVERSION = {
  gal: { returnUnit: 'L', factor: 3.78541, spelled: 'gallons' },
  l:   { returnUnit: 'gal', factor: 1 / 3.78541, spelled: 'liters' },
  mi:  { returnUnit: 'km', factor: 1.60934, spelled: 'miles' },
  km:  { returnUnit: 'mi', factor: 1 / 1.60934, spelled: 'kilometers' },
  lbs: { returnUnit: 'kg', factor: 0.453592, spelled: 'pounds' },
  kg:  { returnUnit: 'lbs', factor: 1 / 0.453592, spelled: 'kilograms' }
};

// Función auxiliar para redondear a 5 decimales
function round5(val) {
  return Math.round(val * 100000) / 100000;
}

// Función para leer y validar el número
function parseNumber(input) {
  if (!input || input.trim() === '') return { error: false, value: 1 };

  const idx = input.search(/[a-zA-Z]/);
  const numStr = idx === -1 ? input : input.slice(0, idx);

  if (numStr.trim() === '') return { error: false, value: 1 };

  const slashCount = (numStr.match(/\//g) || []).length;
  if (slashCount > 1) return { error: true, message: 'invalid number' };

  try {
    if (slashCount === 1) {
      const [numPart, denPart] = numStr.split('/');
      if (numPart === '' || denPart === '') return { error: true, message: 'invalid number' };
      const num = parseFloat(numPart);
      const den = parseFloat(denPart);
      if (isNaN(num) || isNaN(den)) return { error: true, message: 'invalid number' };
      return { error: false, value: num / den };
    } else {
      const val = parseFloat(numStr);
      if (isNaN(val)) return { error: true, message: 'invalid number' };
      return { error: false, value: val };
    }
  } catch (err) {
    return { error: true, message: 'invalid number' };
  }
}

// Función para leer y validar la unidad
function parseUnit(input) {
  if (!input) return { error: true, message: 'invalid unit' };
  const idx = input.search(/[a-zA-Z]/);
  const unitPart = idx === -1 ? '' : input.slice(idx).trim();

  if (!unitPart) return { error: true, message: 'invalid unit' };

  const unitLower = unitPart.toLowerCase();
  const normalized = unitLower === 'l' ? 'l' : unitLower;

  if (CONVERSION.hasOwnProperty(normalized)) {
    return { error: false, value: normalized };
  } else {
    return { error: true, message: 'invalid unit' };
  }
}

// Devuelve la unidad de destino (ej: gal → L)
function getReturnUnit(initUnit) {
  const lower = initUnit.toLowerCase();
  const info = CONVERSION[lower];
  if (!info) return null;
  return info.returnUnit;
}

// Devuelve el nombre completo de la unidad (ej: mi → miles)
function spellOutUnit(unit) {
  const lower = unit.toLowerCase();
  if (!CONVERSION[lower]) return null;
  return CONVERSION[lower].spelled;
}

// Realiza la conversión numérica
function convert(initNum, initUnit) {
  const lower = initUnit.toLowerCase();
  const info = CONVERSION[lower];
  if (!info) return null;
  const result = initNum * info.factor;
  return round5(result);
}

// Arma el texto explicativo final
function getString(initNum, initUnit, returnNum, returnUnit) {
  const initSpelled = spellOutUnit(initUnit);
  const returnSpelled = spellOutUnit(returnUnit);
  return `${initNum} ${initSpelled} converts to ${returnNum} ${returnSpelled}`;
}

// Exporta las funciones para que se usen en api.js
module.exports = {
  parseNumber,
  parseUnit,
  getReturnUnit,
  spellOutUnit,
  convert,
  getString,
  round5
};