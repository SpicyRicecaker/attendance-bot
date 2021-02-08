// @ts-ignore
import type { Config } from './types/types.ts';

// Get config from cmd
const init = (): Config => {
  const DEFAULTCONFIG: Config = {
    irregular: false,
    redo: false,
    noSubmit: false,
    error: false,
    help: false,
  };

  const config: Config = {
    irregular: false,
    redo: false,
    noSubmit: false,
    error: false,
    help: false,
  };
  // Loop through all console args, skipping the first two
  // Can also just erase duplicates but I'm too lazy
  for (let i = 2; i < process.argv.length; i += 1) {
    // eslint-disable-next-line no-console
    console.log(`flag ${i} is ${process.argv[i]}`);
    switch (process.argv[i]) {
      case 'noSubmit': {
        config.noSubmit = !DEFAULTCONFIG.noSubmit;
        break;
      }
      case 'help': {
        config.help = !DEFAULTCONFIG.help;
        break;
      }
      case 'irregular': {
        config.irregular = !DEFAULTCONFIG.irregular;
        break;
      }
      case 'redo': {
        config.redo = !DEFAULTCONFIG.redo;
        break;
      }
      default: {
        config.error = !DEFAULTCONFIG.error;
        break;
      }
    }
  }
  // eslint-disable-next-line no-console
  console.log('Final config is', config);

  return config;
};

export default init;
