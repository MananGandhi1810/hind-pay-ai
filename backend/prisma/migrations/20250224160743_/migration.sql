/*
  Warnings:

  - A unique constraint covering the columns `[vpa]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_vpa_key" ON "User"("vpa");
