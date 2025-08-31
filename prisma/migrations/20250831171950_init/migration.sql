-- CreateTable
CREATE TABLE "public"."themes" (
    "id" SERIAL NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "name_ko" VARCHAR(100) NOT NULL,
    "name_en" VARCHAR(100) NOT NULL,
    "name_it" VARCHAR(100) NOT NULL,
    "easter_egg" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "themes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."words" (
    "id" SERIAL NOT NULL,
    "theme_id" INTEGER NOT NULL,
    "word_ko" VARCHAR(100) NOT NULL,
    "word_en" VARCHAR(100),
    "word_it" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."game_sessions" (
    "id" SERIAL NOT NULL,
    "theme_id" INTEGER,
    "player_count" INTEGER NOT NULL,
    "spy_mode" BOOLEAN NOT NULL DEFAULT false,
    "spy_count" INTEGER NOT NULL DEFAULT 0,
    "time_limit" INTEGER,
    "selected_word_id" INTEGER,
    "language" VARCHAR(5) NOT NULL DEFAULT 'ko',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "themes_type_key" ON "public"."themes"("type");

-- CreateIndex
CREATE INDEX "words_theme_id_idx" ON "public"."words"("theme_id");

-- AddForeignKey
ALTER TABLE "public"."words" ADD CONSTRAINT "words_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."game_sessions" ADD CONSTRAINT "game_sessions_selected_word_id_fkey" FOREIGN KEY ("selected_word_id") REFERENCES "public"."words"("id") ON DELETE SET NULL ON UPDATE CASCADE;
