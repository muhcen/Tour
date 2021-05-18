const dotenv = require('dotenv').config({ path: './config.env' });
let page;
const customPage = require('./helper/customPage');
beforeEach(async () => {
    page = await customPage.build();
    await page.goto('http://127.0.0.1:8000');
}, 10000);

afterEach(async () => {
    await page.close();
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
    await page.login();

    const text = await page.$eval('a.nav__el--logout', (el) => el.innerHTML);
    expect(text).toEqual('Log Out');
});
