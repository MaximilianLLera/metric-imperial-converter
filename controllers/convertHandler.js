function ConvertHandler() {
  this.getNum = function (input) {
    let result;
    const match = input.match(/^[\d/.]+/);
    if (!match) return 1;
    const numStr = match[0];

    // check invalid multiple fractions
    if ((numStr.match(/\//g) || []).length > 1) return null;

    try {
      result = eval(numStr);
    } catch (e) {
      return null;
    }

    if (isNaN(result)) return null;
    return result;
  };

  this.getUnit = function (input) {
    const match = input.match(/[a-zA-Z]+$/);
    if (!match) return null;
    let unit = match[0].toLowerCase();

    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    if (!validUnits.includes(unit)) return null;

    // normalize 'l' to uppercase L
    if (unit === 'l') return 'L';
    return unit;
  };

  this.getReturnUnit = function (initUnit) {
    const unitMap = {
      gal: 'L',
      L: 'gal',
      lbs: 'kg',
      kg: 'lbs',
      mi: 'km',
      km: 'mi',
    };
    return unitMap[initUnit];
  };

  this.spellOutUnit = function (unit) {
    const spell = {
      gal: 'gallons',
      L: 'liters',
      lbs: 'pounds',
      kg: 'kilograms',
      mi: 'miles',
      km: 'kilometers',
    };
    return spell[unit];
  };

  this.convert = function (initNum, initUnit) {
    const conversionRates = {
      gal: 3.78541,
      L: 1 / 3.78541,
      lbs: 0.453592,
      kg: 1 / 0.453592,
      mi: 1.60934,
      km: 1 / 1.60934,
    };

    const result = initNum * conversionRates[initUnit];
    return Number(result.toFixed(5));
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    const initSpell = this.spellOutUnit(initUnit);
    const returnSpell = this.spellOutUnit(returnUnit);
    return `${initNum} ${initSpell} converts to ${returnNum} ${returnSpell}`;
  };
}

module.exports = ConvertHandler;
