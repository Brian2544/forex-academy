import { Client } from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const parseEnvFile = (filePath) => {
  try {
    const contents = readFileSync(filePath, 'utf8');
    const lines = contents.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      if (!line || line.trim().startsWith('#')) continue;
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match) continue;
      const key = match[1];
      const value = match[2];
      env[key] = value;
    }
    return env;
  } catch (error) {
    return {};
  }
};

const isPoolerConnection = (connectionString) => {
  return (connectionString || '').includes('.pooler.supabase.com');
};

const extractConnectionStringFromFile = (filePath) => {
  try {
    const contents = readFileSync(filePath, 'utf8');
    const match = contents.match(/connectionString\s*=\s*['"]([^'"]+)['"]/);
    return match ? match[1] : '';
  } catch (error) {
    return '';
  }
};

const resolveDatabaseUrl = () => {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  if (process.env.SUPABASE_DB_URL) return process.env.SUPABASE_DB_URL;

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const backendDir = join(scriptDir, '..');
  const envFromRoot = parseEnvFile(join(backendDir, '.env'));
  const envFromLocal = parseEnvFile(join(backendDir, 'src', 'config', 'local.env'));

  const envUrl = envFromRoot.DATABASE_URL
    || envFromRoot.SUPABASE_DB_URL
    || envFromLocal.DATABASE_URL
    || envFromLocal.SUPABASE_DB_URL
    || '';

  const fallbackFiles = [
    join(backendDir, 'scripts', 'update-plan-prices.js'),
    join(backendDir, 'scripts', 'migrate-to-usd.js'),
    join(backendDir, 'scripts', 'run-schema-direct.js'),
  ];

  for (const filePath of fallbackFiles) {
    const extracted = extractConnectionStringFromFile(filePath);
    if (extracted) return extracted;
  }

  return envUrl || '';
};

const run = async () => {
  const databaseUrl = resolveDatabaseUrl();
  if (!databaseUrl) {
    console.error('Missing DATABASE_URL or SUPABASE_DB_URL for migrations.');
    process.exit(1);
  }

  if (!isPoolerConnection(databaseUrl)) {
    console.error('Refusing to run migrations on non-pooler connection.');
    process.exit(1);
  }

  const scriptDir = dirname(fileURLToPath(import.meta.url));
  const backendDir = join(scriptDir, '..');
  const migrationsPath = join(backendDir, 'database', 'migrations');
  const migrationFile = join(migrationsPath, '008_fix_course_payments_and_payment_intents.sql');
  const sql = readFileSync(migrationFile, 'utf8');

  const client = new Client({ connectionString: databaseUrl });
  try {
    console.log('Running migration: 008_fix_course_payments_and_payment_intents.sql');
    await client.connect();
    await client.query(sql);
    console.log('Migration completed successfully.');

    const tablesToCheck = ['payments', 'entitlements', 'payment_intents'];
    const checkResults = await client.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = ANY($1::text[])`,
      [tablesToCheck]
    );
    const found = new Set((checkResults.rows || []).map((row) => row.table_name));
    tablesToCheck.forEach((tableName) => {
      if (found.has(tableName)) {
        console.log(`✅ ${tableName}: exists`);
      } else {
        console.log(`❌ ${tableName}: not found`);
      }
    });
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
};

run();
