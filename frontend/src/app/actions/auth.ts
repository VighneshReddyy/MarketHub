"use server";

import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginUser(email: string, password: string) {
  console.log("=== SERVER ACTION CALLED: loginUser ===");
  console.log("Email:", email, "Password length:", password?.length);
  try {
    const db = getDbConnection();
    console.log("DB Pool acquired");
    
    // Using a prepared statement to prevent SQL injection
    const [rows] = await db.query(
      "SELECT user_id, name, email, is_admin FROM Users WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    );

    const users = rows as any[];
    console.log("Query returned rows:", users.length);

    if (users.length > 0) {
      const user = users[0];
      
      // Set a mocked JWT/session token indicating successful login
      const cookieStore = await cookies();
      cookieStore.set("auth_token", Buffer.from(JSON.stringify(user)).toString("base64"), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 // 1 day
      });

      console.log("Login success! Cookie set.");
      return { success: true };
    }

    console.log("Invalid credentials");
    return { error: "Invalid email or password" };
  } catch (error: any) {
    console.error("=== Login Error ===", error);
    return { error: `Server error: ${error.message}` };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("auth_token");
  redirect("/");
}
