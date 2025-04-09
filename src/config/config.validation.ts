import { plainToInstance, Type } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsNumber,
  validateSync,
  ValidateNested,
} from 'class-validator';

export class DatabaseConfig {
  @IsString()
  type: string;

  @IsString()
  host: string;

  @IsNumber()
  port: number;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  database: string;

  @IsBoolean()
  synchronize: boolean;

  @IsBoolean()
  logging: boolean;
}

export class Config {
  @ValidateNested()
  @Type(() => DatabaseConfig)
  database: DatabaseConfig;
}

export function validate(config: Record<string, any>): void {
  const validatedConfig = plainToInstance(Config, config);

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}
