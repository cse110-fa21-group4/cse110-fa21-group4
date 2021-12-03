const { expect } = require("@jest/globals");
const puppeteer = require('puppeteer');

describe("testing for the website", () => {
    // Visit the website

    /**
    * @jest-environment jsdom
    */
    beforeAll(async () => {
        await page.goto("https://nan-bread-4.herokuapp.com/");
    }, 100000000);
    
    it("Initial Page Test - Check for searchbar and search button", async () => {
        console.log("Checking for searchbar and button");
        const searchBar = page.$(".searchContainer");
        expect(searchBar).toBeDefined();
    });
}, 100000000)