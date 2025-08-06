-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "image" TEXT,
    "emailVerified" DATETIME,
    "role" TEXT NOT NULL DEFAULT 'user',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" DATETIME,
    "phone" TEXT,
    "location" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "github" TEXT,
    "twitter" TEXT,
    "instagram" TEXT,
    "education" TEXT,
    "experience" TEXT,
    "skills" TEXT,
    "interests" TEXT,
    "selectedField" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "showEmail" BOOLEAN NOT NULL DEFAULT false,
    "showPhone" BOOLEAN NOT NULL DEFAULT false,
    "showLocation" BOOLEAN NOT NULL DEFAULT false,
    "showStats" BOOLEAN NOT NULL DEFAULT true,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "pushNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_users" ("bio", "createdAt", "education", "email", "emailNotifications", "emailVerified", "experience", "github", "id", "image", "instagram", "interests", "isActive", "isPublic", "lastLoginAt", "linkedin", "location", "name", "password", "phone", "pushNotifications", "role", "selectedField", "showEmail", "showLocation", "showPhone", "showStats", "skills", "smsNotifications", "twitter", "updatedAt", "website") SELECT "bio", "createdAt", "education", "email", "emailNotifications", "emailVerified", "experience", "github", "id", "image", "instagram", "interests", "isActive", "isPublic", "lastLoginAt", "linkedin", "location", "name", "password", "phone", "pushNotifications", "role", "selectedField", "showEmail", "showLocation", "showPhone", "showStats", "skills", "smsNotifications", "twitter", "updatedAt", "website" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
