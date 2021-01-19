// Type definitions Gity for pg-prepares
/// <reference types="node" />
/// <reference types="pg" />

import { Client } from "pg";

export async function runPreparedStatements(client: Client): Promise<void>;
