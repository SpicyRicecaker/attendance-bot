export interface studentClass {
  name: string;
  class: string;
  form: string;
  start: string;
  end: string;
  schedule: string[];
}


export interface Config {
  noSubmit: boolean;
  help: boolean;
  error: boolean;
  irregular: boolean;
  redo: boolean;
}