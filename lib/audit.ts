/**
 * Audit Logger Middleware
 * 
 * Helper function to create audit log entries for CRUD operations.
 * Usage: await createAuditLog({ userId, userName, action, resource, resourceId, details });
 * 
 * NOTE: Currently disabled - AuditLog model needs to be added to Prisma schema
 */

export async function createAuditLog({
  userId,
  userName,
  action,
  resource,
  resourceId,
  details,
}: {
  userId: string;
  userName: string;
  action: "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT";
  resource: string;
  resourceId?: string | null;
  details?: string | null;
}) {
  // TODO: Enable when AuditLog model is added to schema
  console.log("[AUDIT] Feature not yet implemented:", { userId, userName, action, resource });
  return;
  /*
  try {
    await fetch("/api/admin/audit-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        userName,
        action,
        resource,
        resourceId,
        details,
      }),
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
  */
}

/**
 * Server-side audit logging (use in API routes)
 * NOTE: Currently disabled - AuditLog model needs to be added to Prisma schema
 */
export async function createAuditLogServer({
  userId,
  userName,
  action,
  resource,
  resourceId,
  details,
  ipAddress,
  userAgent,
}: {
  userId: string;
  userName: string;
  action: "CREATE" | "READ" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT" | "EXPORT";
  resource: string;
  resourceId?: string | null;
  details?: string | null;
  ipAddress?: string;
  userAgent?: string;
}) {
  // TODO: Enable when AuditLog model is added to schema
  console.log("[AUDIT] Feature not yet implemented:", { userId, userName, action, resource });
  return;
  /*
  const { prisma } = await import("@/lib/prisma");
  
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userName,
        action,
        resource,
        resourceId,
        details,
        ipAddress: ipAddress || "unknown",
        userAgent: userAgent || "unknown",
      },
    });
  } catch (error) {
    console.error("Failed to create audit log:", error);
  }
  */
}
