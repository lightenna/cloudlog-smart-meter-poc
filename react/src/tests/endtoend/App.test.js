import React from 'react';
import puppeteer from 'puppeteer';
const debug = false;

describe('App end-to-end', () => {

    it('h1 loads correctly', async () => {
        let browser = await puppeteer.launch({
            headless: true
        });
        let page = await browser.newPage();
        page.emulate({
            viewport: { width: 500, height: 2400 },
            userAgent: ''
        });

        await page.goto('http://localhost:3000/');
        await page.waitForSelector('#view-manager');

        const html = await page.$eval('.masterDocsList', e => e.innerHTML);
        if (debug && false) console.log(html);

        browser.close();
    }, 5000); //ms

});
