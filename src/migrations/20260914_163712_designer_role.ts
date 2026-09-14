import { type MigrateUpArgs, type MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Only add access roles. Keep the legacy banner columns untouched; their
  // removal was suggested by the schema generator but is outside this change.
  await db.execute(sql`
    CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'designer');
    ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'designer' NOT NULL;
    UPDATE "users" SET "role" = 'admin';
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN "role";
    DROP TYPE "public"."enum_users_role";
  `)
}
