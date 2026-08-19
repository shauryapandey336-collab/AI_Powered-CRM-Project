import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { prisma } from "../config/database.js";

export const getDashboardSummary = asyncHandler(async (req, res) => {
  const organizationId = req.organizationId;

  const [
    totalLeads,
    statusCounts,
    sourceCounts,
    recentLeads
  ] = await Promise.all([
    prisma.lead.count({
      where: { organizationId }
    }),
    prisma.lead.groupBy({
      by: ["status"],
      where: { organizationId },
      _count: { status: true }
    }),
    prisma.lead.groupBy({
      by: ["source"],
      where: { organizationId },
      _count: { source: true }
    }),
    prisma.lead.findMany({
      where: { organizationId },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        company: true,
        status: true,
        score: true,
        createdAt: true
      }
    })
  ]);

  const byStatus = {
    NEW: 0,
    CONTACTED: 0,
    QUALIFIED: 0,
    PROPOSAL: 0,
    WON: 0,
    LOST: 0
  };

  statusCounts.forEach((item) => {
    byStatus[item.status] = item._count.status;
  });

  const bySource = {
    CSV: 0,
    MANUAL: 0,
    WEBSITE: 0,
    OTHER: 0
  };

  sourceCounts.forEach((item) => {
    bySource[item.source] = item._count.source;
  });

  const conversionRate = totalLeads > 0 ? parseFloat(((byStatus.WON / totalLeads) * 100).toFixed(1)) : 0;

  return sendSuccess(res, 200, "Dashboard metrics fetched successfully", {
    totalLeads,
    newLeads: byStatus.NEW,
    contactedLeads: byStatus.CONTACTED,
    qualifiedLeads: byStatus.QUALIFIED,
    proposalLeads: byStatus.PROPOSAL,
    wonLeads: byStatus.WON,
    lostLeads: byStatus.LOST,
    conversionRate,
    byStatus,
    bySource,
    recentLeads
  });
});
