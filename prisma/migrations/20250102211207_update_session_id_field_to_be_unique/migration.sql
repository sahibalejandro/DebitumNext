/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `Session` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Session_session_id_key" ON "Session"("session_id");
