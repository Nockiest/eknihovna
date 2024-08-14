-- CreateTable
CREATE TABLE "knihy" (
    "id" VARCHAR(255) NOT NULL,
    "book_code" INTEGER,
    "name" VARCHAR(100),
    "author" VARCHAR(100),
    "category" VARCHAR(50),
    "genres" TEXT[],
    "umisteni" VARCHAR(100),
    "signatura" VARCHAR(50),
    "zpusob_ziskani" VARCHAR(100),
    "formaturita" BOOLEAN,
    "available" BOOLEAN,
    "rating" INTEGER,

    CONSTRAINT "knihy_pkey" PRIMARY KEY ("id")
);
