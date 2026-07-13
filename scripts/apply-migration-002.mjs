/**
 * Apply supabase/migrations/002_question_bank_phase1a.sql using SUPABASE_DB_URL.
 *
 *   SUPABASE_DB_URL='postgresql://…' node scripts/apply-migration-002.mjs
 *
 * Get URI: Supabase → Project Settings → Database → Connection string (URI).
 * Use Session mode (port 5432) or Transaction/Session pooler as documented by Supabase.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = resolve(__dirname, "../supabase/migrations/002_question_bank_phase1a.sql");
const url = process.env.SUPABASE_DB_URL;

if (!url) {
  console.error(
    "Missing SUPABASE_DB_URL.\n" +
      "Copy the Postgres URI from Supabase Dashboard → Settings → Database,\n" +
      "then: SUPABASE_DB_URL='postgresql://…' node scripts/apply-migration-002.mjs",
  );
  process.exit(1);
}

const sql = readFileSync(sqlPath, "utf8");
const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query(sql);
  const { rows } = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'questions'
      and column_name in ('cognitive_level', 'aim', 'strand', 'visibility')
    order by 1
  `);
  console.log("Migration 002 applied. New/updated columns:");
  for (const row of rows) {
    console.log(`  - ${row.column_name} (${row.data_type})`);
  }
  if (rows.length < 4) {
    console.warn("Expected 4 columns; got", rows.length);
    process.exit(2);
  }
} finally {
  await client.end();
}
