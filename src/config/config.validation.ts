import { plainToInstance } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsPort,
  validateSync,
  ValidateNested,
} from 'class-validator';

export class DatabaseConfig {
  @IsString()
  type: string;

  @IsString()
  host: string;

  @IsPort()
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
  database: DatabaseConfig;
}

export function validate(config: Record<string, any>): void {
  const validatedConfig = plainToInstance(Config, config, {
    excludeExtraneousValues: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
}
