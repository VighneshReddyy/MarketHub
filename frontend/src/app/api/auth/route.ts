import { NextResponse } from "next/server";
import { getDbConnection } from "@/lib/db";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const { action, name, email, password } = await request.json();
    console.log(`=== API ROUTE CALLED: ${action} ===`);

    if (!email || !password || (action === "register" && !name)) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const db = getDbConnection();
    
    if (action === "register") {
      // Check if user exists
      const [existing] = await db.query("SELECT user_id FROM Users WHERE email = ? LIMIT 1", [email]);
      if ((existing as any[]).length > 0) {
        return NextResponse.json({ error: "Email already registered" }, { status: 400 });
      }
      
      // Insert user
      const [result] = await db.query(
        "INSERT INTO Users (name, email, password, is_admin) VALUES (?, ?, ?, false)",
        [name, email, password]
      );
      
      const insertId = (result as any).insertId;
      
      const cookieStore = await cookies();
      cookieStore.set("auth_token", Buffer.from(JSON.stringify({ user_id: insertId, name, email, is_admin: 0 })).toString("base64"), {
        httpOnly: true, path: "/", maxAge: 60 * 60 * 24
      });
      return NextResponse.json({ success: true, message: "Account created successfully" });
    }
    
    // Login logic
    
    // Using a prepared statement to prevent SQL injection
    const [rows] = await db.query(
      "SELECT user_id, name, email, is_admin FROM Users WHERE email = ? AND password = ? LIMIT 1",
      [email, password]
    );

    const users = rows as any[];
    console.log("Query returned rows:", users.length);

    if (users.length > 0) {
      const user = users[0];
      
      const cookieStore = await cookies();
      cookieStore.set("auth_token", Buffer.from(JSON.stringify(user)).toString("base64"), {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 // 1 day
      });

      console.log("Login success! Cookie set.");
      return NextResponse.json({ success: true, is_admin: user.is_admin === 1 || user.is_admin === true });
    }

    console.log("Invalid credentials");
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  } catch (error: any) {
    console.error("=== Login Error ===", error);
    return NextResponse.json({ error: `Server error: ${error.message}` }, { status: 500 });
  }
}
