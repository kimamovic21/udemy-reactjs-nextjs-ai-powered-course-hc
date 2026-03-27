"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import db from "@/lib/db";

export const getCurrentRazorpayStatus = async () => {
  const user = await auth.api.getSession({
    headers: await headers(),
  });

  const dbUser = await db.user.findUnique({
    where: {
      id: user?.user?.id,
    },
    select: {
      razorpayPlan: true,
    },
  });

  return dbUser.razorpayPlan;
};
