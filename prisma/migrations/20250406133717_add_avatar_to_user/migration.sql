-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "imagePublicId" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "videoPublicId" TEXT,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "avatarPublicId" TEXT,
ADD COLUMN     "introVideoUrl" TEXT,
ADD COLUMN     "videoPublicId" TEXT;
