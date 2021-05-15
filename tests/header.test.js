const puppeteer = require("puppeteer");

test("add two number", () => {
  const sum = 1 + 4;

  expect(sum).toEqual(5);
});

test("create browsre interface", async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:8000/overview");
});
