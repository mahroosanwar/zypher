"use server";

import { revalidatePath } from "next/cache";

import { blockUser, unblockUser } from "@/lib/block-service";
import { getSelf } from "@/lib/auth-service";

import { RoomServiceClient } from "livekit-server-sdk";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_APP_SECRET!
);

export const onBlock = async (id: string) => {
  const self = await getSelf();

  let blockedUser;
  try {
    blockedUser = await blockUser(id);
  } catch {
    /// this means that user is guest
  }

  try {
    await roomService.removeParticipant(self.id, id);
  } catch {
    //this means  user is not in the room
  }

  revalidatePath(`/u/${self.username}/community`);

  if (blockedUser) {
    revalidatePath(`/${blockedUser.blocked.username}`);
  }

  return blockedUser;
};

export const onUnblock = async (id: string) => {
  const self = await getSelf();
  const unblockedUser = await unblockUser(id);

  revalidatePath(`/u/${self.username}/community`);

  return unblockedUser;
};
