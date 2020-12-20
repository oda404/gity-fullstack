import { Client } from "pg";
export declare function runMigrations(client: Client): Promise<void>;
