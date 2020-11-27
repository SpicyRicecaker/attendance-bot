/* eslint-disable */
import days from './days.js';
import linker from './links.js';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
puppeteer.use(StealthPlugin());
// Bring in the .env file, which has some *sensitive* info
import dotenv from 'dotenv';
import type { Browser } from 'puppeteer-extra/dist/puppeteer';
// Configure the environment accordingly
dotenv.config();

// parse and compare minute hour string
// given hours and minutes of the form
const isInsideTime = (startTime: string, endTime: string, date: Date) => {
  // Get start hour, start minutes, end hour, end minutes
  const startStrs = [...startTime.split(':'), ...endTime.split(':')];
  const startNums = startStrs.map((value) => parseInt(value, 10));
  // let timeRange = {
  //   startHour: startNums[0],
  //   startMinutes: startNums[1],
  //   endHour: startNums[2],
  //   endMinutes: startNums[3],
  // };
  // Get the amount of time in class by subtracting start by endtime
  const classTime =
    startNums[2] * 60 + startNums[3] - (startNums[0] * 60 + startNums[1]);
  // Gets the amount of time between now and the beginning of class
  const currentDiff =
    date.getHours() * 60 +
    date.getMinutes() -
    (startNums[0] * 60 + startNums[1]);
  // If the time between now and the beginning of class is greater than -6 (5 min early)
  // but less than the full length of the actual class, then this class is within time
  return currentDiff >= -6 && currentDiff <= classTime;
};

const asyncTimeout = (callback: any, time: number) =>
  new Promise((resolve) => resolve(setTimeout(callback, time)));

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

const openZoomLink = async (browser: Browser, link: string): Promise<any> => {
  const t = await browser.newPage();
  await t.goto(link);
  t.on('dialog', async (dialog: any) => {
    await dialog.accept();
  });
};

const openAllForms = async (browser: Browser, classes: any[]) => {
  for (let i = 0; i < classes.length; ++i) {
    const t = await browser.newPage();
    await t.goto(classes[i].form);
  }
  // await browser.close();
};

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  await signIntoGoogle(browser);

  let date: Date = new Date();
  const day: string | undefined = days.get(date.getDay());

  // Get all classes from json
  const allClasses: any[] = JSON.parse(
    await linker.fsReadPromise(linker.jsonPath)
  );
  // Get classes today
  const classesToday = allClasses.filter((value) =>
    value.schedule.includes(day)
  );
  let currentClassName: string;

  // First open all attendance for classes today
  await openAllForms(browser, classesToday);

  const loop = async () => {
    // Update date
    date = new Date();
    // If new day restart program
    if (days.get(date.getDay()) !== day) {
      return main();
    }

    // Filter classes today to find one that matches current date and time
    const classrn = classesToday.filter((value) =>
      isInsideTime(value.start, value.end, date)
    );
    // Open the zoom link for the class if there is one
    for (let i = 0; i < classrn.length; ++i) {
      if (classrn[i].name !== currentClassName) {
        await openZoomLink(browser, classrn[i].class);
        currentClassName = classrn[i].name;
      }
    }
    // Wait a min~
    return asyncTimeout(loop, 60000);
  };
  await loop();
};

main();
