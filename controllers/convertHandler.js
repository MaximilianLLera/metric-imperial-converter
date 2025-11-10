const VALID_UNITS = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];

const CONVERSION = {
  gal: { returnUnit: 'L', factor: 3.78541 },
  L:   { returnUnit: 'gal', factor: 1 / 3.78541 },
  lbs: { returnUnit: 'kg', factor: 0.453592 },
  kg:  { returnUnit: 'lbs', factor: 1 / 0.453592 },
  mi:  { returnUnit: 'km', factor: 1.60934 },
  km:  { returnUnit: 'mi', factor: 1 / 1.60934 }
};

const SPELL_OUT = {
  gal: 'gallons',
  L: 'liters',
  lbs: 'pounds',
  kg: 'kilograms',
  mi: 'miles',
  km: 'kilometers'
};

function parseNumber(input) {
  const numMatch = input.match(/^[.\d\/]+/);
  const numStr = numMatch ? numMatch[0] : '';
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

function parseUnit(input) {
  const unitMatch = input.match(/[a-zA-Z]+$/);
  if (!unitMatch) return { unit: null, err: 'invalid unit' };

  let unit = unitMatch[0].toLowerCase();
  if (unit === 'l') unit = 'L';

  if (!VALID_UNITS.includes(unit)) return { unit: null, err: 'invalid unit' };
  return { unit, err: null };
}

function convert(initNum, initUnit) {
  const conv = CONVERSION[initUnit];
  if (!conv) return null;
  const returnNum = initNum * conv.factor;
  const returnUnit = conv.returnUnit;
  return { returnNum, returnUnit };
}

function formatResult(initNum, initUnit, returnNum, returnUnit) {
  const rounded = parseFloat(returnNum.toFixed(5));
  const string = `${initNum} ${SPELL_OUT[initUnit]} converts to ${rounded} ${SPELL_OUT[returnUnit]}`;
  return {
    initNum,
    initUnit,
    returnNum: rounded,
    returnUnit,
    string
  };
}

module.exports = {
  handleConvert(req, res) {
    const input = req.query.input;
    if (!input) return res.send('invalid number and unit');

    const numParsed = parseNumber(input);
    const unitParsed = parseUnit(input);

    if (numParsed.err && unitParsed.err) return res.send('invalid number and unit');
    if (numParsed.err) return res.send('invalid number');
    if (unitParsed.err) return res.send('invalid unit');

    const { value: initNum } = numParsed;
    const { unit: initUnit } = unitParsed;
    const conv = convert(initNum, initUnit);
    if (!conv) return res.send('invalid unit');

    const out = formatResult(initNum, initUnit, conv.returnNum, conv.returnUnit);
    res.json(out);
  }
};

