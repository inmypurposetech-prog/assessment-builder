#!/usr/bin/env bash
# Apply supabase/migrations/002_question_bank_phase1a.sql to the linked cloud project.
# Usage:
#   export SUPABASE_DB_URL='postgresql://postgres.[ref]:[PASSWORD]@aws-0-….pooler.supabase.com:6543/postgres'
#   ./scripts/apply-migration-002.sh
#
# Get the URI from: Supabase Dashboard → Project Settings → Database → Connection string (URI)
# Prefer the "Session mode" pooler URI for one-off DDL.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SQL="$ROOT/supabase/migrations/002_question_bank_phase1a.sql"

if [[ -z "${SUPABASE_DB_URL:-}" ]]; then
  echo "Set SUPABASE_DB_URL to your Supabase Postgres URI (Dashboard → Settings → Database)."
  exit 1
fi

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found. Installing via npx postgres runner…"
  npx --yes supabase@latest db execute --file "$SQL" --db-url "$SUPABASE_DB_URL"
else
  psql "$SUPABASE_DB_URL" -v ON_ERROR_STOP=1 -f "$SQL"
fi

echo "Migration 002 applied. Verifying columns…"
psql "$SUPABASE_DB_URL" -c "select column_name, data_type from information_schema.columns where table_schema='public' and table_name='questions' and column_name in ('cognitive_level','aim','strand','visibility') order by 1;" 2>/dev/null || true
