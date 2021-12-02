const { test, expect } = require('@jest/globals');
const functions = require('../src/scripts/addRecipe.js');
test('extraction test1', async () => {   
    const extract = await functions.extraction('https://foodista.com/recipe/ZHK4KPB6/chocolate-crinkle-cookies');
    expect(extract).toBe('object');
});
test('extraction test2', async () => {
    const extract = await functions.extraction('https://foodista.com/recipe/ZHK4KPB6/chocolate-crinkle-cookies');
    expect(extract).toBeDefined();
});
