/*
  Warnings:

  - You are about to drop the `course_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `forum_comment_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_applications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `job_postings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `resources` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `scheduled_notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_preferences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `title` on the `activity_logs` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `career_goals` table. All the data in the column will be lost.
  - You are about to alter the column `progress` on the `career_goals` table. The data in that column could be lost. The data in that column will be cast from `Float` to `Int`.
  - You are about to drop the column `category` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `certifications` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `demand` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `estimatedSalary` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `isCompleted` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `modules` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `progress` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `roadmapId` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `career_roadmaps` table. All the data in the column will be lost.
  - You are about to drop the column `hiddenAt` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `isHidden` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `isPasswordProtected` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `passwordHash` on the `chat_messages` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `forum_categories` table. All the data in the column will be lost.
  - You are about to drop the column `icon` on the `forum_categories` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `forum_categories` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `forum_categories` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `forum_comments` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `forum_comments` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `forum_comments` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `forum_posts` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `forum_posts` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `forum_posts` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `forum_posts` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `projectId` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `messages` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `milestones` table. All the data in the column will be lost.
  - You are about to drop the column `sentAt` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `action` on the `progress_tracking` table. All the data in the column will be lost.
  - You are about to drop the column `createdById` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `currentMembers` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `difficulty` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `lookingFor` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `teamSize` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `views` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `averageSalary` on the `software_fields` table. All the data in the column will be lost.
  - You are about to drop the column `demandLevel` on the `software_fields` table. All the data in the column will be lost.
  - You are about to drop the column `jobGrowth` on the `software_fields` table. All the data in the column will be lost.
  - You are about to drop the column `learningPath` on the `software_fields` table. All the data in the column will be lost.
  - You are about to drop the column `personalityTraits` on the `software_fields` table. All the data in the column will be lost.
  - You are about to drop the column `requiredSkills` on the `software_fields` table. All the data in the column will be lost.
  - You are about to drop the column `color` on the `user_achievements` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[postId,userId]` on the table `forum_post_likes` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `action` to the `activity_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `career_recommendations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `oceanResultId` to the `career_recommendations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fieldName` to the `career_roadmaps` table without a default value. This is not possible if the table is not empty.
  - Made the column `title` on table `chat_sessions` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `description` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `forum_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category` to the `forum_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `forum_posts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `milestones` table without a default value. This is not possible if the table is not empty.
  - Made the column `description` on table `milestones` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `type` to the `user_achievements` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "course_progress_userId_courseId_key";

-- DropIndex
DROP INDEX "forum_comment_likes_userId_commentId_key";

-- DropIndex
DROP INDEX "forum_post_likes_userId_postId_key";

-- DropIndex
DROP INDEX "job_applications_jobPostingId_applicantId_key";

-- DropIndex
DROP INDEX "project_members_projectId_userId_key";

-- DropIndex
DROP INDEX "user_preferences_userId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "course_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "forum_comment_likes";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "job_applications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "job_postings";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "project_members";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "resources";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "scheduled_notifications";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_preferences";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "security_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "details" TEXT,
    "data" TEXT,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "security_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "project_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "project_applications_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "project_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "issuer" TEXT NOT NULL,
    "issueDate" DATETIME NOT NULL,
    "expiryDate" DATETIME,
    "certificateUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "certificates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activity_logs" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "metadata" TEXT,
    "data" TEXT,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_activity_logs" ("createdAt", "data", "description", "id", "type", "userId") SELECT "createdAt", "data", "description", "id", "type", "userId" FROM "activity_logs";
DROP TABLE "activity_logs";
ALTER TABLE "new_activity_logs" RENAME TO "activity_logs";
CREATE TABLE "new_career_goals" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "targetDate" DATETIME,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "career_goals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_career_goals" ("createdAt", "description", "id", "progress", "targetDate", "title", "updatedAt", "userId") SELECT "createdAt", "description", "id", "progress", "targetDate", "title", "updatedAt", "userId" FROM "career_goals";
DROP TABLE "career_goals";
ALTER TABLE "new_career_goals" RENAME TO "career_goals";
CREATE TABLE "new_career_recommendations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "oceanResultId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "confidence" REAL NOT NULL,
    "description" TEXT NOT NULL,
    "reasoning" TEXT,
    "learningPath" TEXT,
    "nextSteps" TEXT,
    "requiredSkills" TEXT,
    "salaryRange" TEXT,
    "jobMarket" TEXT,
    "onetCompatibility" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "career_recommendations_oceanResultId_fkey" FOREIGN KEY ("oceanResultId") REFERENCES "ocean_results" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "career_recommendations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_career_recommendations" ("confidence", "createdAt", "field", "id", "learningPath", "nextSteps", "reasoning", "userId") SELECT "confidence", "createdAt", "field", "id", "learningPath", "nextSteps", "reasoning", "userId" FROM "career_recommendations";
DROP TABLE "career_recommendations";
ALTER TABLE "new_career_recommendations" RENAME TO "career_recommendations";
CREATE TABLE "new_career_roadmaps" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "fieldName" TEXT NOT NULL,
    "currentLevel" INTEGER NOT NULL DEFAULT 1,
    "totalLevels" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "career_roadmaps_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_career_roadmaps" ("createdAt", "id", "updatedAt", "userId") SELECT "createdAt", "id", "updatedAt", "userId" FROM "career_roadmaps";
DROP TABLE "career_roadmaps";
ALTER TABLE "new_career_roadmaps" RENAME TO "career_roadmaps";
CREATE TABLE "new_chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sessionId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "modelUsed" TEXT,
    "tokensUsed" INTEGER,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "chat_sessions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_chat_messages" ("content", "id", "modelUsed", "role", "sessionId", "timestamp", "tokensUsed") SELECT "content", "id", "modelUsed", "role", "sessionId", "timestamp", "tokensUsed" FROM "chat_messages";
DROP TABLE "chat_messages";
ALTER TABLE "new_chat_messages" RENAME TO "chat_messages";
CREATE TABLE "new_chat_sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "chat_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_chat_sessions" ("createdAt", "id", "title", "updatedAt", "userId") SELECT "createdAt", "id", "title", "updatedAt", "userId" FROM "chat_sessions";
DROP TABLE "chat_sessions";
ALTER TABLE "new_chat_sessions" RENAME TO "chat_sessions";
CREATE TABLE "new_courses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roadmapId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT,
    "duration" TEXT,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "courses_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "career_roadmaps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_courses" ("createdAt", "duration", "id", "isCompleted", "roadmapId", "title", "updatedAt", "url") SELECT "createdAt", "duration", "id", "isCompleted", "roadmapId", "title", "updatedAt", "url" FROM "courses";
DROP TABLE "courses";
ALTER TABLE "new_courses" RENAME TO "courses";
CREATE TABLE "new_forum_categories" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_forum_categories" ("createdAt", "description", "id", "isActive", "name") SELECT "createdAt", "description", "id", "isActive", "name" FROM "forum_categories";
DROP TABLE "forum_categories";
ALTER TABLE "new_forum_categories" RENAME TO "forum_categories";
CREATE UNIQUE INDEX "forum_categories_name_key" ON "forum_categories"("name");
CREATE TABLE "new_forum_comments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "postId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "forum_comments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "forum_posts" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "forum_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_forum_comments" ("content", "createdAt", "id", "postId", "updatedAt") SELECT "content", "createdAt", "id", "postId", "updatedAt" FROM "forum_comments";
DROP TABLE "forum_comments";
ALTER TABLE "new_forum_comments" RENAME TO "forum_comments";
CREATE TABLE "new_forum_posts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isLocked" BOOLEAN NOT NULL DEFAULT false,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "tags" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "forum_posts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_forum_posts" ("content", "createdAt", "id", "isLocked", "isPinned", "title", "updatedAt") SELECT "content", "createdAt", "id", "isLocked", "isPinned", "title", "updatedAt" FROM "forum_posts";
DROP TABLE "forum_posts";
ALTER TABLE "new_forum_posts" RENAME TO "forum_posts";
CREATE TABLE "new_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "messages_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_messages" ("content", "createdAt", "id", "isRead", "receiverId", "senderId") SELECT "content", "createdAt", "id", "isRead", "receiverId", "senderId" FROM "messages";
DROP TABLE "messages";
ALTER TABLE "new_messages" RENAME TO "messages";
CREATE TABLE "new_milestones" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roadmapId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" INTEGER NOT NULL,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "milestones_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "career_roadmaps" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_milestones" ("createdAt", "description", "id", "isCompleted", "roadmapId", "title", "updatedAt") SELECT "createdAt", "description", "id", "isCompleted", "roadmapId", "title", "updatedAt" FROM "milestones";
DROP TABLE "milestones";
ALTER TABLE "new_milestones" RENAME TO "milestones";
CREATE TABLE "new_notifications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "data", "id", "isRead", "message", "title", "type", "userId") SELECT "createdAt", "data", "id", "isRead", "message", "title", "type", "userId" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE TABLE "new_ocean_results" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "openness" REAL NOT NULL,
    "conscientiousness" REAL NOT NULL,
    "extraversion" REAL NOT NULL,
    "agreeableness" REAL NOT NULL,
    "neuroticism" REAL NOT NULL,
    "answers" TEXT,
    "onetScores" TEXT,
    "onetAnswers" TEXT,
    "recommendedFields" TEXT NOT NULL,
    "testDuration" INTEGER NOT NULL,
    "questionsAnswered" INTEGER NOT NULL,
    "testDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ocean_results_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_ocean_results" ("agreeableness", "conscientiousness", "extraversion", "id", "neuroticism", "openness", "questionsAnswered", "recommendedFields", "testDate", "testDuration", "userId") SELECT "agreeableness", "conscientiousness", "extraversion", "id", "neuroticism", "openness", "questionsAnswered", "recommendedFields", "testDate", "testDuration", "userId" FROM "ocean_results";
DROP TABLE "ocean_results";
ALTER TABLE "new_ocean_results" RENAME TO "ocean_results";
CREATE TABLE "new_progress_tracking" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "roadmapId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "itemType" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "progress_tracking_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "career_roadmaps" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "progress_tracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_progress_tracking" ("completedAt", "createdAt", "id", "itemId", "itemType", "roadmapId", "userId") SELECT "completedAt", "createdAt", "id", "itemId", "itemType", "roadmapId", "userId" FROM "progress_tracking";
DROP TABLE "progress_tracking";
ALTER TABLE "new_progress_tracking" RENAME TO "progress_tracking";
CREATE UNIQUE INDEX "progress_tracking_userId_itemId_key" ON "progress_tracking"("userId", "itemId");
CREATE TABLE "new_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "requirements" TEXT,
    "budget" TEXT,
    "deadline" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_projects" ("category", "createdAt", "description", "id", "isActive", "title", "updatedAt") SELECT "category", "createdAt", "description", "id", "isActive", "title", "updatedAt" FROM "projects";
DROP TABLE "projects";
ALTER TABLE "new_projects" RENAME TO "projects";
CREATE TABLE "new_software_fields" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_software_fields" ("category", "createdAt", "description", "id", "name", "updatedAt") SELECT "category", "createdAt", "description", "id", "name", "updatedAt" FROM "software_fields";
DROP TABLE "software_fields";
ALTER TABLE "new_software_fields" RENAME TO "software_fields";
CREATE UNIQUE INDEX "software_fields_name_key" ON "software_fields"("name");
CREATE TABLE "new_user_achievements" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "achievementId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT,
    "unlockedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "earnedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_achievements_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_user_achievements" ("achievementId", "description", "earnedAt", "icon", "id", "title", "userId") SELECT "achievementId", "description", "earnedAt", "icon", "id", "title", "userId" FROM "user_achievements";
DROP TABLE "user_achievements";
ALTER TABLE "new_user_achievements" RENAME TO "user_achievements";
CREATE UNIQUE INDEX "user_achievements_userId_achievementId_key" ON "user_achievements"("userId", "achievementId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "forum_post_likes_postId_userId_key" ON "forum_post_likes"("postId", "userId");
