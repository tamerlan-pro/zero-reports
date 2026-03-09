-- AlterTable: convert title and description from text to jsonb (preserving existing string values)
ALTER TABLE "Report" ALTER COLUMN "title" TYPE jsonb USING to_jsonb(title);
ALTER TABLE "Report" ALTER COLUMN "description" TYPE jsonb USING to_jsonb(description);
