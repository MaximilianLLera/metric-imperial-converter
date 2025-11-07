const chai = require('chai');
const assert = chai.assert;
const handler = require('../controllers/convertHandler.js');

suite('Unit Tests', function() {

  test('Debe leer correctamente un número entero', function() {
    const result = handler.parseNumber('5kg');
    assert.equal(result.value, 5);
  });

  test('Debe leer correctamente un número decimal', function() {
    const result = handler.parseNumber('5.2kg');
    assert.equal(result.value, 5.2);
  });

  test('Debe leer correctamente una fracción', function() {
    const result = handler.parseNumber('1/2kg');
    assert.equal(result.value, 0.5);
  });

  test('Debe leer correctamente una fracción con decimales', function() {
    const result = handler.parseNumber('2.5/5kg');
    assert.equal(result.value, 0.5);
  });

  test('Debe devolver error en fracción doble', function() {
    const result = handler.parseNumber('3/2/3kg');
    assert.isTrue(result.error);
  });

  test('Debe usar valor por defecto 1 cuando no hay número', function() {
    const result = handler.parseNumber('kg');
    assert.equal(result.value, 1);
  });

  test('Debe leer correctamente unidades válidas', function() {
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    validUnits.forEach(unit => {
      const result = handler.parseUnit('3' + unit);
      assert.equal(result.value, unit);
    });
  });

  test('Debe devolver error para unidad inválida', function() {
    const result = handler.parseUnit('3gramos');
    assert.isTrue(result.error);
  });

  test('Debe devolver unidad de retorno correcta', function() {
    assert.equal(handler.getReturnUnit('gal'), 'L');
    assert.equal(handler.getReturnUnit('L'), 'gal');
    assert.equal(handler.getReturnUnit('mi'), 'km');
    assert.equal(handler.getReturnUnit('km'), 'mi');
    assert.equal(handler.getReturnUnit('lbs'), 'kg');
    assert.equal(handler.getReturnUnit('kg'), 'lbs');
  });

  test('Debe devolver nombre completo correcto de cada unidad', function() {
    assert.equal(handler.spellOutUnit('gal'), 'gallons');
    assert.equal(handler.spellOutUnit('L'), 'liters');
    assert.equal(handler.spellOutUnit('mi'), 'miles');
    assert.equal(handler.spellOutUnit('km'), 'kilometers');
    assert.equal(handler.spellOutUnit('lbs'), 'pounds');
    assert.equal(handler.spellOutUnit('kg'), 'kilograms');
  });

  test('Debe convertir correctamente gal a L', function() {
    assert.approximately(handler.convert(1, 'gal'), 3.78541, 0.1);
  });

  test('Debe convertir correctamente L a gal', function() {
    assert.approximately(handler.convert(1, 'L'), 0.26417, 0.1);
  });

  test('Debe convertir correctamente mi a km', function() {
    assert.approximately(handler.convert(1, 'mi'), 1.60934, 0.1);
  });

  test('Debe convertir correctamente km a mi', function() {
    assert.approximately(handler.convert(1, 'km'), 0.62137, 0.1);
  });

  test('Debe convertir correctamente lbs a kg', function() {
    assert.approximately(handler.convert(1, 'lbs'), 0.45359, 0.1);
  });

  test('Debe convertir correctamente kg a lbs', function() {
    assert.approximately(handler.convert(1, 'kg'), 2.20462, 0.1);
  });

});