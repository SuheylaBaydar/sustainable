import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getUserById, type PublicUser } from "@/lib/pg";

export interface AdminUser extends PublicUser {
  username?: string;
}

// Oturum (NextAuth JWT) sahibinin admin olup olmadığını kontrol eder.
// Credentials ile giren admin için JWT içindeki username bilgisi yeterlidir;
// DB erişimi varsa ayrıca PostgreSQL kaydı da doğrulanır.
export async function getAdmin(req: NextRequest): Promise<AdminUser | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "local-development-secret-change-me-please-123456789",
  });
  if (!token?.sub) return null;

  if ((token as any).username === "admin") {
    return {
      id: String(token.sub),
      username: "admin",
      name: token.name ?? "Admin",
      email: token.email ?? "admin@example.com",
    };
  }

  try {
    const me = await getUserById(token.sub);
    if (!me || me.username !== "admin") return null;
    return me;
  } catch {
    return null;
  }
}

// Oturum açmış herhangi bir kullanıcıyı PostgreSQL kaydıyla birlikte döndürür.
// PostgreSQL'e ulaşılamazsa JWT'deki kullanıcı bilgisiyle temel oturum döndürülür.
export async function getSignedInUser(req: NextRequest): Promise<PublicUser | null> {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "local-development-secret-change-me-please-123456789",
  });
  if (!token?.sub) return null;

  try {
    const dbUser = await getUserById(token.sub);
    if (dbUser) return dbUser;
  } catch {
    // DB hatasında oturumu tamamen düşürmeyelim.
  }

  return {
    id: String(token.sub),
    username: (token as any).username,
    name: token.name ?? null,
    email: token.email ?? null,
  };
}
