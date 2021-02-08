import { promises as fs } from 'fs';
// import path from 'path';

class DateDB {
  dateFile: string = '';

  date: Date = new Date();

  init = async () => {
    this.dateFile = 'date.json';
    try {
      this.date = new Date(
        JSON.parse(await fs.readFile(this.dateFile, 'utf-8')).date
      );
    } catch (e) {
      // Make new date that isn't today
      this.date = new Date();
      this.date.setDate(this.date.getDate() - 1);
      this.writeSelf(JSON.stringify({ date: this.date }));
    }
  };

  getDate = () => this.date;

  writeSelf = async (dateObject: string) =>
    fs.writeFile(this.dateFile, dateObject);

  static isSameDay = (a: Date, b: Date): boolean =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

export default DateDB;
