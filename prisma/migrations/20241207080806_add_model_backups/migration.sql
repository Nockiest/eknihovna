-- CreateTable
CREATE TABLE "backups" (
    "id" VARCHAR(255) NOT NULL,
    "user" VARCHAR(255),
    "backupat" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "backups_pkey" PRIMARY KEY ("id")
);
