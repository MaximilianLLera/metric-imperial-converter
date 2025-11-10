const VALID_UNITS = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];

const SPELL_OUT = {
  gal: 'gallons',
  L: 'liters',
  mi: 'miles',
  km: 'kilometers',
  lbs: 'pounds',
  kg: 'kilograms'
};

const CONVERSION = {
  gal: { unit: 'L', factor: 3.78541 },
  L: { unit: 'gal', factor: 1 / 3.78541 },
  lbs: { unit: 'kg', factor: 0.453592 },
  kg: { unit: 'lbs', factor: 1 / 0.453592 },
  mi: { unit: 'km', factor: 1.60934 },
  km: { unit: 'mi', factor: 1 / 1.60934 }
};

// ---- NÚMERO ----
function parseNumber(input) {
  const match = input.match(/^[^a-zA-Z]*/);
  const numStr = (match && match[0]) ? match[0].trim() : '';

  if (!numStr) return { value: 1, err: null };

  const slashCount = (numStr.match(/\//g) || []).length;
  if (slashCount > 1) return { value: null, err: 'invalid number' };

  if (slashCount === 1) {
    const [num, den] = numStr.split('/');
    const n = parseFloat(num);
    const d = parseFloat(den);
    if (isNaN(n) || isNaN(d) || d === 0) return { value: null, err: 'invalid number' };
    return { value: n / d, err: null };
  }

  const val = parseFloat(numStr);
  if (isNaN(val)) return { value: null, err: 'invalid number' };
  return { value: val, err: null };
}

// ---- UNIDAD ----
function parseUnit(input) {
  const unitMatch = input.match(/[a-zA-Z]+$/);
  if (!unitMatch) return { unit: null, err: 'invalid unit' };

  let unit = unitMatch[0].toLowerCase();
  if (unit === 'l') unit = 'L';

  if (VALID_UNITS.includes(unit)) {
    return { unit, err: null };
  } else {
    return { unit: null, err: 'invalid unit' };
  }
}

// ---- CONVERTIR ----
function convert(initNum, initUnit) {
  const conv = CONVERSION[initUnit];
  if (!conv) return null;
  const result = initNum * conv.factor;
  return { result, returnUnit: conv.unit };
}

// ---- FORMATEAR RESULTADO ----
function formatResult(initNum, initUnit, returnNum, returnUnit) {
  const roundedReturnNum = parseFloat(returnNum.toFixed(5));
  const initUnitString = SPELL_OUT[initUnit];
  const returnUnitString = SPELL_OUT[returnUnit];

  return {
    initNum,
    initUnit,
    returnNum: roundedReturnNum,
    returnUnit,
    string: `${initNum} ${initUnitString} converts to ${roundedReturnNum} ${returnUnitString}`
  };
}

// ---- MANEJADOR ----
module.exports = {
  handleConvert(req, res) {
    const input = req.query.input;
    if (!input) return res.send('invalid input');

    const numParsed = parseNumber(input);
    const unitParsed = parseUnit(input);

    if (numParsed.err && unitParsed.err) return res.send('invalid number and unit');
    if (numParsed.err) return res.send('invalid number');
    if (unitParsed.err) return res.send('invalid unit');

    const initNum = numParsed.value;
    const initUnit = unitParsed.unit;
    const conv = convert(initNum, initUnit);
    if (!conv) return res.send('invalid unit');

    const out = formatResult(initNum, initUnit, conv.result, conv.returnUnit);
    res.json(out);
  }
};
