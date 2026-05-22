/*
  Warnings:

  - The values [LIBRARY] on the enum `PaymentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `academicTermId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `credits` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `departmentId` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `room` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `academicTermId` on the `enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `dateOfBirth` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `students` table. All the data in the column will be lost.
  - You are about to drop the column `middleName` on the `students` table. All the data in the column will be lost.
  - You are about to drop the `academic_terms` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `departments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `emergency_contacts` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[studentId,courseId]` on the table `enrollments` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `category` to the `courses` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `type` on the `lesson_resources` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('VIDEO', 'PDF', 'DOCUMENT', 'IMAGE');

-- CreateEnum
CREATE TYPE "HowHeard" AS ENUM ('SOCIAL_MEDIA', 'FRIEND', 'OTHER');

-- CreateEnum
CREATE TYPE "StudentBackground" AS ENUM ('STUDENT', 'GRADUATE', 'PROFESSIONAL');

-- CreateEnum
CREATE TYPE "SkillLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentType_new" AS ENUM ('TUITION', 'REGISTRATION', 'EXAM_FEE', 'OTHER');
ALTER TABLE "payments" ALTER COLUMN "type" TYPE "PaymentType_new" USING ("type"::text::"PaymentType_new");
ALTER TYPE "PaymentType" RENAME TO "PaymentType_old";
ALTER TYPE "PaymentType_new" RENAME TO "PaymentType";
DROP TYPE "public"."PaymentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_academicTermId_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "emergency_contacts" DROP CONSTRAINT "emergency_contacts_studentId_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT "enrollments_academicTermId_fkey";

-- DropIndex
DROP INDEX "enrollments_studentId_courseId_academicTermId_key";

-- AlterTable
ALTER TABLE "courses" DROP COLUMN "academicTermId",
DROP COLUMN "credits",
DROP COLUMN "departmentId",
DROP COLUMN "room",
ADD COLUMN     "batch" INTEGER,
ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "durationMonths" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "icon" TEXT,
ADD COLUMN     "registrationFee" INTEGER NOT NULL DEFAULT 5000,
ADD COLUMN     "trainingFee" INTEGER NOT NULL DEFAULT 70000;

-- AlterTable
ALTER TABLE "enrollments" DROP COLUMN "academicTermId",
ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "lesson_resources" ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "title" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "MediaType" NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "momoNumber" TEXT;

-- AlterTable
ALTER TABLE "students" DROP COLUMN "address",
DROP COLUMN "dateOfBirth",
DROP COLUMN "gender",
DROP COLUMN "middleName",
ADD COLUMN     "background" "StudentBackground",
ADD COLUMN     "batch" INTEGER,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "fieldOfStudy" TEXT,
ADD COLUMN     "followsSocial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "howHeard" "HowHeard",
ADD COLUMN     "joinChallenge" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "referrer" TEXT,
ADD COLUMN     "school" TEXT,
ADD COLUMN     "skillLevel" "SkillLevel",
ADD COLUMN     "whyEnrolled" TEXT;

-- DropTable
DROP TABLE "academic_terms";

-- DropTable
DROP TABLE "departments";

-- DropTable
DROP TABLE "emergency_contacts";

-- DropEnum
DROP TYPE "AcademicTermType";

-- DropEnum
DROP TYPE "ResourceType";

-- CreateTable
CREATE TABLE "EmergencyContact" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,

    CONSTRAINT "EmergencyContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_media" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "duration" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "course_media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmergencyContact_studentId_key" ON "EmergencyContact"("studentId");

-- CreateIndex
CREATE INDEX "course_media_courseId_idx" ON "course_media"("courseId");

-- CreateIndex
CREATE INDEX "course_media_type_idx" ON "course_media"("type");

-- CreateIndex
CREATE UNIQUE INDEX "enrollments_studentId_courseId_key" ON "enrollments"("studentId", "courseId");

-- AddForeignKey
ALTER TABLE "EmergencyContact" ADD CONSTRAINT "EmergencyContact_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_media" ADD CONSTRAINT "course_media_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
