import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';
import { validate } from './config.validation';
import { Config } from './config.validation';

export default (): Config => {
  const environment = process.env.NODE_ENV || 'development';

  const config = yaml.load(
    readFileSync(join(process.cwd(), `config.${environment}.yaml`), 'utf8')
  ) as Record<string, any>;

  validate(config);

  return config as Config;
};
