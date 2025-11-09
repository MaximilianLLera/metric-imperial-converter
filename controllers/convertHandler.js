const VALID_UNITS = ['gal','l','mi','km','lbs','kg'];

const SPELL_OUT = {
  gal: 'gallons',
  L: 'liters',
  l: 'liters',
  mi: 'miles',
  km: 'kilometers',
  lbs: 'pounds',
  kg: 'kilograms'
};

// conversion rates (to returnUnit)
const CONVERSION = {
  gal: { unit: 'L', factor: 3.78541 },
  L:   { unit: 'gal', factor: 1/3.78541 },
  l:   { unit: 'gal', factor: 1/3.78541 },
  lbs: { unit: 'kg', factor: 0.453592 },
  kg:  { unit: 'lbs', factor: 1/0.453592 },
  mi:  { unit: 'km', factor: 1.60934 },
  km:  { unit: 'mi', factor: 1/1.60934 }
};

function parseNumber(input) {
  // get substring until first letter
  const match = input.match(/^[^a-zA-Z]*/);
  const numStr = (match && match[0]) ? match[0].trim() : '';
  if (!numStr) return { value: 1, err: null }; // default to 1

  // check for multiple slashes (invalid)
  const slashCount = (numStr.match(/\//g) || []).length;
  if (slashCount > 1) return { value: null, err: 'invalid number' };

  // if fraction like 3/2 or decimal or 2.5/6 (decimal numerator or denominator)
  if (slashCount === 1) {
    const [num, den] = numStr.split('/');
    if (!num || !den) return { value: null, err: 'invalid number' };
    const n = parseFloat(num);
    const d = parseFloat(den);
    if (isNaN(n) || isNaN(d) || d === 0) return { value: null, err: 'invalid number' };
    return { value: n / d, err: null };
  }

  // no slash: plain number
  const val = parseFloat(numStr);
  if (isNaN(val)) return { value: null, err: 'invalid number' };
  return { value: val, err: null };
}

function parseUnit(input) {
  const unitMatch = input.match(/[a-zA-Z]+$/);
  if (!unitMatch) return { unit: null, err: 'invalid unit' };
  let unit = unitMatch[0];

  // Accept both upper and lower. standardize to lowercase except 'L'
  if (unit.toLowerCase() === 'l') unit = 'L'; // prefer uppercase for liter
  else unit = unit.toLowerCase();

  // validate
  const validLower = VALID_UNITS.map(u => u.toLowerCase());
  if (validLower.includes(unit.toLowerCase()) || unit === 'L') {
    return { unit, err: null };
  } else {
    return { unit: null, err: 'invalid unit' };
  }
}

function formatResult(initNum, initUnit, returnNum, returnUnit) {
  // ensure unit string form: liters -> 'L' uppercase; others lower
  const initUnitDisplay = (initUnit.toLowerCase() === 'l') ? 'L' : initUnit.toLowerCase();
  const returnUnitDisplay = (returnUnit.toLowerCase() === 'l') ? 'L' : returnUnit.toLowerCase();

  const initUnitString = (initUnitDisplay === 'L') ? 'liters' : SPELL_OUT[initUnitDisplay] || SPELL_OUT[initUnit];
  const returnUnitString = (returnUnitDisplay === 'L') ? 'liters' : SPELL_OUT[returnUnitDisplay];

  const roundedReturnNum = Number(returnNum.toFixed(5));
  return {
    initNum,
    initUnit: initUnitDisplay,
    returnNum: roundedReturnNum,
    returnUnit: returnUnitDisplay,
    string: `${initNum} ${initUnitString} converts to ${roundedReturnNum} ${returnUnitString}`
  };
}

function convert(initNum, initUnit) {
  // normalized key for conversions
  const key = (initUnit === 'L') ? 'L' : initUnit.toLowerCase();
  const conv = CONVERSION[key];
  if (!conv) return null;
  const result = initNum * conv.factor;
  const returnUnit = conv.unit;
  return { result, returnUnit };
}

module.exports = {
  handleConvert(req, res) {
    const input = req.query.input;
    if (typeof input === 'undefined') {
      return res.json({ error: 'no input' });
    }

    const numParsed = parseNumber(input);
    const unitParsed = parseUnit(input);

    // handle combined errors
    if (numParsed.err && unitParsed.err) {
      return res.send('invalid number and unit');
    }
    if (numParsed.err) {
      return res.send('invalid number');
    }
    if (unitParsed.err) {
      return res.send('invalid unit');
    }

    const initNum = numParsed.value;
    const initUnit = unitParsed.unit; // may be 'L' or lower-case unit
    const conv = convert(initNum, initUnit);

    if (!conv) return res.send('invalid unit');

    const out = formatResult(initNum, initUnit, conv.result, conv.returnUnit);
    return res.json(out);
  }
};