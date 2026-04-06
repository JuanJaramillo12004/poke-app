-- CreateTable
CREATE TABLE "PokemonCache" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "pokemonId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "types" JSONB NOT NULL,
    "baseStats" JSONB NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCache_pokemonId_key" ON "PokemonCache"("pokemonId");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonCache_name_key" ON "PokemonCache"("name");

-- CreateIndex
CREATE INDEX "PokemonCache_name_idx" ON "PokemonCache"("name");