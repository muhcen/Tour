const puppeteer = require('puppeteer');
const { tokenFactory } = require('./../factories/tokenFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: false,
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, property) {
                return customPage[property] || browser[property] || page[property];
            },
        });
    }
    constructor(page) {
        this.page = page;
    }

    async login() {
        const token = tokenFactory('5c8a1e1a2f8fb814b56fa182');

        await this.page.setCookie({ name: 'jwt', value: token });

        await this.page.goto('http://127.0.0.1:8000');

        await this.page.waitFor('a.nav__el--logout');
    }
}

module.exports = CustomPage;
