import "reflect-metadata";
import { DataSource } from "typeorm";
import { config } from "dotenv";
import { join } from "path";

config({ path: join(process.cwd(), "../../.env") });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "",
  database: process.env.DATABASE_NAME || "travel_saas",
  entities: [join(process.cwd(), "src/**/*.entity.ts")],
  migrations: [join(process.cwd(), "src/database/migrations/*.ts")],
  synchronize: true,
  logging: false,
});
