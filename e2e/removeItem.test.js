import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('CRM form', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // headless: false, // show gui
      // slowMo: 100,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  test('Adding item to CRM', async () => {
    await page.goto(baseUrl);

    const crmAddBtn = await page.$('.crm-header-add');

    await crmAddBtn.click();
    await page.waitForSelector('.active');


    const savebtn = await page.$('.btn-save');
    const inputName = await page.$('.popup-input-text');
    const inputPrice = await page.$('.popup-input-price');

    const itemName = 'LG CX OLED 55';
    const itemPrice = '150000';

    await inputName.type(itemName);
    await inputPrice.type(itemPrice);

    await savebtn.click();

    await crmAddBtn.click();

    const itemName1 = 'LG GX OLED 55';
    const itemPrice1 = '160000';

    await inputName.type(itemName1);
    await inputPrice.type(itemPrice1);

    await savebtn.click();

    const remover = await page.$('.item-action-remove');
    await remover.click();

    const itemContainer = await page.$('.items-container');
    const item = await itemContainer.$$('.item-wrapper');

    expect(item.length).toBe(1);

  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
