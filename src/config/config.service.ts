import { Injectable } from '@nestjs/common';
import * as z from 'zod';
import { config as parseConfig } from 'dotenv';

const schema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  LOG_LEVEL: z
    .enum(['error', 'warning', 'info', 'debug', 'silly'])
    .default('debug'),
  DATABASE_URL: z.string().nonempty(),
  LOG_SQL_REQUEST: z
    .string()
    .transform((value) => value === 'true')
    .default('false'),
  PORT: z.string()
    .transform(value => parseInt(value))
    .default('3000'),
});

type EnvConfig = z.infer<typeof schema>;

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    try {
      parseConfig();
    } catch (e) {}

    this.envConfig = this.validateInput(process.env);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: any): EnvConfig {
    const result = schema.safeParse(envConfig);

    if (result.success === false) {
      throw new Error(`Config validation error: ${result.error.toString()}`);
    }
    return result.data;
  }

  get nodeEnv(): string {
    return this.envConfig.NODE_ENV;
  }

  get databaseUrl(): string {
    return this.envConfig.DATABASE_URL;
  }

  get isLoggingDb(): boolean {
    return this.envConfig.LOG_SQL_REQUEST;
  }

  get loggerLevel(): string {
    return this.envConfig.LOG_LEVEL;
  }

  get port(): number {
    return this.envConfig.PORT;
  }
}
