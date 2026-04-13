"use server";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

const isDbTimeoutError = (error) => {
    if (!error) return false;
    const message = String(error.message || "").toLowerCase();
    return error.code === "P1008" || error.code === "P1001" || message.includes("timed out") || message.includes("connection timeout") || message.includes("no database host or connection string");
};



export const onBoardUser = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return { success: false, error: "No authenticated user found" };
        }

        const { id, firstName, lastName, imageUrl, emailAddresses } = user;

       
        const newUser = await db.user.upsert({
            where: {
                clerkId: id
            },
            update: {
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
                
            },
            create: {
                clerkId: id,
                firstName: firstName || null,
                lastName: lastName || null,
                imageUrl: imageUrl || null,
                email: emailAddresses[0]?.emailAddress || "",
                
            }
        });

        
        
        return { 
            success: true, 
            user: newUser,
            message: "User onboarded successfully" 
        };

    } catch (error) {
        if (!isDbTimeoutError(error)) {
            console.error("❌ Error onboarding user:", error?.message || error);
        }
        return { 
            success: false, 
            error: "Failed to onboard user" 
        };
    }
};


export const currentUserRole = async () => {
    try {
        const user = await currentUser();

        if (!user) {
            return null;
        }

        const { id } = user;

        const userRole = await db.user.findUnique({
            where: {
                clerkId: id
            },
            select: {
                role: true
            }
        }); 

        return userRole?.role ?? null;
    } catch (error) {
        if (!isDbTimeoutError(error)) {
            console.error("❌ Error fetching user role:", error?.message || error);
        }
        return null;
    }
};



export const getCurrentUserData = async () => {
    try {
        const user = await currentUser();
        const data = await db.user.findUnique({
            where:{
                clerkId: user.id
            },
            include:{
                submissions: true,
                solvedProblems: true,
                playlists: true
            }
        })
        return data;
    } catch (error) {
        if (!isDbTimeoutError(error)) {
            console.error("❌ Error fetching user:", error?.message || error);
        }
        return { success: false, error: "Failed to fetch user" };
    }
};