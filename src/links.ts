/* eslint-disable */
// this file mostly serves just to find our links for class
// import filereader and path
import { promises as fs } from 'fs';
import path from 'path';
import type { studentClass } from './types/types';

const datePath: string = path.join(path.resolve(), 'src', 'date.json');

// Holds the filepath and also eventuall class
class ClassDB {
  fileJsonPath: string = path.join(path.resolve(), 'src', 'links.json');

  readStudentClasses = async (filePath: string): Promise<studentClass[]> =>
    // First get the links.json file
    JSON.parse(await fs.readFile(filePath, 'utf8'));
}

export default { readStudentClasses };
