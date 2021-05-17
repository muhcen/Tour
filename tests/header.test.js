const puppeteer = require('puppeteer');
const dotenv = require('dotenv').config({ path: './config.env' });
let browser, page;
const { tokenFactory } = require('./factories/tokenFactory');
beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false,
    });
    page = await browser.newPage();
    await page.goto('http://127.0.0.1:8000');
}, 10000);

afterEach(async () => {
    await browser.close();
});

test('the header has correct name', async () => {
    const text = await page.$eval('a.nav__el', (el) => el.innerHTML);
    expect(text).toEqual('All tours');
});

test('click an the button and check', async () => {
    await page.click('a.btn--small');

    const url = await page.url();

    expect(url).toMatch(/tour/);
});

test('when sgined in, show logout button', async () => {
    const token = tokenFactory('5c8a1e1a2f8fb814b56fa182');

    await page.setCookie({ name: 'jwt', value: token });

    await page.goto('http://127.0.0.1:8000');

    await page.waitFor('a.nav__el--logout');

    const text = await page.$eval('a.nav__el--logout', (el) => el.innerHTML);
    expect(text).toEqual('Log Out');
});
