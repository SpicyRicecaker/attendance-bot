/* eslint-disable */
// this file mostly serves just to find our links for class
// import filereader and path
import { promises as fs } from 'fs';
import path from 'path';
import type { studentClass } from './types/types';

// Holds the filepath and also eventuall class
class ClassDB {
  classFile: string = '';
  classes: studentClass[] = [];
  constructor() {
    this.classFile = path.join(path.resolve(), 'src', 'links.json');
    // this.init();
  }
  init = async () => {
    try {
      this.classes = JSON.parse(await fs.readFile(this.classFile, 'utf-8'));
    } catch (e) {
      console.log(e, "couldn't find file RIP");
      this.classes = [];
    }
  };
  getClasses = (): studentClass[] => this.classes;
  getClassesToday = (today: string): studentClass[] =>
    this.classes.filter((value) => value.schedule.includes(today));
}

export default ClassDB;
