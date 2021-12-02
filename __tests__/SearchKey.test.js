const { test, expect } = require('@jest/globals');
const functions = require('../src/scripts/searchKey.js');
test('searchKey test1', async () => {   
    const search = await functions.extraction('https://foodista.com/recipe/ZHK4KPB6/chocolate-crinkle-cookies');
    expect(extract).toBe('object');
});
test('getInstruction test1', async () => {
    const extract = await functions.extraction('https://foodista.com/recipe/ZHK4KPB6/chocolate-crinkle-cookies');
    expect(extract).toBeDefined();
});