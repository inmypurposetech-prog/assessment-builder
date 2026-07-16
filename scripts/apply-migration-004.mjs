/**
 * Apply supabase/migrations/004_templates_phase1e.sql using SUPABASE_DB_URL.
 *
 *   SUPABASE_DB_URL='postgresql://…' node scripts/apply-migration-004.mjs
 *
 * Or paste the SQL into Supabase → SQL Editor → Run.
 * Get URI: Supabase → Project Settings → Database → Connection string (URI).
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = resolve(__dirname, "../supabase/migrations/004_templates_phase1e.sql");
const url = process.env.SUPABASE_DB_URL;

if (!url) {
  console.error(
    "Missing SUPABASE_DB_URL.\n" +
      "Copy the Postgres URI from Supabase Dashboard → Settings → Database,\n" +
      "then: SUPABASE_DB_URL='postgresql://…' node scripts/apply-migration-004.mjs",
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
  const { rows: tables } = await client.query(`
    select column_name, data_type
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'templates'
    order by ordinal_position
  `);
  const { rows: assessmentCols } = await client.query(`
    select column_name
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'assessments'
      and column_name = 'template_id'
  `);
  const { rows: buckets } = await client.query(`
    select id, public, file_size_limit
    from storage.buckets
    where id = 'templates'
  `);
  console.log("Migration 004 applied. templates columns:", tables.length);
  for (const row of tables) {
    console.log(`  - ${row.column_name} (${row.data_type})`);
  }
  console.log(
    "assessments.template_id:",
    assessmentCols.length ? "present" : "MISSING",
  );
  console.log(
    "storage.buckets.templates:",
    buckets[0]
      ? `public=${buckets[0].public} limit=${buckets[0].file_size_limit}`
      : "MISSING",
  );
  if (tables.length < 8 || assessmentCols.length < 1 || buckets.length < 1) {
    console.warn("Expected templates table + template_id + bucket; check output.");
    process.exit(2);
  }
} finally {
  await client.end();
}
