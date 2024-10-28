import { createUploadthing, type FileRouter } from "uploadthing/next";

import { UploadThingError } from "uploadthing/server";

import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";

const uploadthing = createUploadthing();

export const ourFileRouter = {
  thumbnailUploader: uploadthing({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      const self = await getSelf();
      if (!self) throw new UploadThingError("Unauthorized");
      return { user: self };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("File uploaded:", file);
      await db.stream.update({
        where: {
          userId: metadata.user.id,
        },
        data: {
          thumbnailUrl: file.url,
        },
      });

      return { fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
