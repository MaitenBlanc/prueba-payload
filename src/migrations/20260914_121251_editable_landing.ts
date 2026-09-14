import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import initialContent from './data/landing-initial-content.json'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages" ADD COLUMN "layout" jsonb;
    ALTER TABLE "_pages_v" ADD COLUMN "version_layout" jsonb;`)
  const content = JSON.stringify(initialContent)
  await db.execute(sql`UPDATE "pages" SET "layout" = ${content}::jsonb WHERE "slug" = 'inicio' AND "layout" IS NULL`)
  await db.execute(sql`UPDATE "_pages_v" SET "version_layout" = ${content}::jsonb WHERE "version_slug" = 'inicio' AND "version_layout" IS NULL`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Export edited landing content before deliberately rolling back these columns.
  await db.execute(sql`ALTER TABLE "pages" DROP COLUMN "layout";
    ALTER TABLE "_pages_v" DROP COLUMN "version_layout";`)
}

