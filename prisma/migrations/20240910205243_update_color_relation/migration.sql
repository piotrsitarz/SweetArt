/*
  Warnings:

  - You are about to drop the column `userId` on the `Color` table. All the data in the column will be lost.
  - Added the required column `userName` to the `Color` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Color" DROP CONSTRAINT "Color_userId_fkey";

-- AlterTable
ALTER TABLE "Color" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Color" ADD CONSTRAINT "Color_userName_fkey" FOREIGN KEY ("userName") REFERENCES "User"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
