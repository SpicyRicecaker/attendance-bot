import type { Browser } from 'puppeteer-extra/dist/puppeteer';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import dotenv from 'dotenv';
// Bring in the .env file, which has some *sensitive* info
// @ts-ignore: Importing .ts
import ClassDB from './classDB.ts';
// @ts-ignore: Importing .ts
import DateDB from './dateDB.ts';
// @ts-ignore: Importing .ts
import type { Config } from './types/types.ts';
// @ts-ignore: Importing .ts
import initConfig from './config.ts';

// Configure puppeteer
puppeteer.use(StealthPlugin());

// Configure the environment accordingly
dotenv.config();

const signIntoGoogle = async (browser: Browser) => {
  // const context = await browser.newPage();
  const page = await browser.newPage();

  await page.goto('https://accounts.google.com');

  await page.waitForSelector('input[type="email"]');
  await page.type('input[type="email"]', process.env.GOOGLE_USER as string);
  await page.click('#identifierNext');

  await page.waitForSelector('input[type="password"]', { visible: true });
  await page.type('input[type="password"]', process.env.GOOGLE_PWD as string);

  await page.waitForSelector('#passwordNext', { visible: true });
  await page.click('#passwordNext');

  return page.waitForNavigation();
};

const fillOutAllForms = async (
  browser: Browser,
  classes: any[],
  config: Config
) => {
  /* eslint-disable no-await-in-loop */
  // Loop through all of our classes today
  for (let i = 0; i < classes.length; i += 1) {
    // Open a new tab
    const t = await browser.newPage();
    // Open that classes' google form
    await t.goto(classes[i].form);
    // The Google form navigates so you have to wait
    await t.waitForNavigation();
    // Next loop through all of our automation steps
    for (let j = 0; j < classes[i].automation.length; j += 1) {
      // If the description of the current selector is not a submit button,
      // or we're submitting every form, complete every action
      if (
        classes[i].automation[j].description !== 'Submit' ||
        !config.noSubmit
      ) {
        // Is it a button or a text area?
        switch (classes[i].automation[j].action) {
          case 'type': {
            // Type content
            await t.type(
              classes[i].automation[j].selector,
              classes[i].automation[j].content
            );
            break;
          }
          case 'click': {
            // Click on button
            await t.click(classes[i].automation[j].selector);
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }
  /* eslint-enable no-await-in-loop */
  // await browser.close();
};

const help = (config: Config) => {
  // eslint-disable-next-line no-console
  console.log('Available flags:');
  Object.keys(config).forEach((key) => {
    // eslint-disable-next-line no-console
    console.log(key);
  });
};

const main = async (config: Config) => {
  if (config.help) {
    help(config);
    return;
  }
  if (config.error) {
    // eslint-disable-next-line no-console
    console.log('Unrecognized option, `help` for help');
    return;
  }

  // First get today's date
  const today = new Date();

  // Open up our 'database' and compare dates
  const lastOpened = new DateDB();
  await lastOpened.init();

  // If we have not opened attendance for today, or if it's a redo
  if (!DateDB.isSameDay(today, lastOpened.getDate()) || config.redo) {
    // Compile our classes database
    const classDB = new ClassDB();
    await classDB.init();

    // Get day of the week
    // If irregular just set it to monday lol
    const todayDay = config.irregular
      ? 'Monday'
      : today.toLocaleString('en-US', { weekday: 'long' });

    try {
      // Open the browser
      const browser = await puppeteer.launch({ headless: false });
      // Sign into google
      await signIntoGoogle(browser);

      // Then fill out all attendance for classes today
      await fillOutAllForms(browser, classDB.getClassesToday(todayDay), config);

      // Update our lastopened database
      lastOpened.writeSelf(JSON.stringify({ date: today }));

      // Close the browser
      // await browser.close();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('something went wrong opening the browser...', e);
    }
  }
};

main(initConfig());
