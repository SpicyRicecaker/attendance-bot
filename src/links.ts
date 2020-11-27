/* eslint-disable */
// this file mostly serves just to find our links for class
// import filereader and path
import fs from 'fs';
import path from 'path';

const jsonPath:string = path.join(path.resolve(), 'src', 'links.json');

const fsReadPromise = (filePath: string):Promise<string> =>
  new Promise((resolve, reject) => {
    // First get the links.json file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

export default { jsonPath, fsReadPromise };
