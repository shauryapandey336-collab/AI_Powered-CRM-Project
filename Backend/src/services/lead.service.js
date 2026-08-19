import { prisma } from "../config/database.js";
import { getPaginationParams, formatPagination } from "../utils/pagination.js";

export const getLeads = async (organizationId, query) => {
  const { page, limit, skip } = getPaginationParams(query);
  const { search, status, source, sortBy = "createdAt", sortOrder = "desc" } = query;

  const where = {
    organizationId
  };

  if (status) {
    where.status = status;
  }

  if (source) {
    where.source = source;
  }

  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { company: { contains: search, mode: "insensitive" } },
      { jobTitle: { contains: search, mode: "insensitive" } }
    ];
  }

  const validSortFields = ["createdAt", "firstName", "score", "status", "company"];
  const orderByField = validSortFields.includes(sortBy) ? sortBy : "createdAt";
  const orderByDirection = sortOrder.toLowerCase() === "asc" ? "asc" : "desc";

  const [total, leads] = await Promise.all([
    prisma.lead.count({ where }),
    prisma.lead.findMany({
      where,
      skip,
      take: limit,
      orderBy: { [orderByField]: orderByDirection },
      include: {
        assignedTo: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  ]);

  return {
    data: leads,
    pagination: formatPagination(total, page, limit)
  };
};

export const getLeadById = async (id, organizationId) => {
  const lead = await prisma.lead.findFirst({
    where: {
      id,
      organizationId
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      activities: {
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }
    }
  });

  if (!lead) {
    const error = new Error("Lead not found");
    error.statusCode = 404;
    throw error;
  }

  return lead;
};

export const createLead = async (data, organizationId, createdById) => {
  const existing = await prisma.lead.findUnique({
    where: {
      organizationId_email: {
        organizationId,
        email: data.email.toLowerCase()
      }
    }
  });

  if (existing) {
    const error = new Error("A lead with this email already exists in your organization");
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const lead = await tx.lead.create({
      data: {
        ...data,
        email: data.email.toLowerCase(),
        organizationId
      },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    await tx.leadActivity.create({
      data: {
        leadId: lead.id,
        createdById,
        type: "NOTE",
        description: `Lead created via ${lead.source}`
      }
    });

    return lead;
  });
};

export const updateLead = async (id, data, organizationId, userId) => {
  const currentLead = await getLeadById(id, organizationId);

  return prisma.$transaction(async (tx) => {
    if (data.email && data.email.toLowerCase() !== currentLead.email) {
      const existing = await tx.lead.findUnique({
        where: {
          organizationId_email: {
            organizationId,
            email: data.email.toLowerCase()
          }
        }
      });
      if (existing && existing.id !== id) {
        const error = new Error("A lead with this email already exists in your organization");
        error.statusCode = 400;
        throw error;
      }
      data.email = data.email.toLowerCase();
    }

    const updatedLead = await tx.lead.update({
      where: { id },
      data,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (data.status && data.status !== currentLead.status) {
      await tx.leadActivity.create({
        data: {
          leadId: id,
          createdById: userId,
          type: "STATUS_CHANGE",
          description: `Status updated from ${currentLead.status} to ${data.status}`
        }
      });
    }

    return updatedLead;
  });
};

export const deleteLead = async (id, organizationId) => {
  await getLeadById(id, organizationId);

  await prisma.lead.delete({
    where: { id }
  });

  return true;
};

export const addLeadActivity = async (leadId, organizationId, createdById, { type, description }) => {
  await getLeadById(leadId, organizationId);

  return prisma.leadActivity.create({
    data: {
      leadId,
      createdById,
      type,
      description
    },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};

export const getLeadActivities = async (leadId, organizationId) => {
  await getLeadById(leadId, organizationId);

  return prisma.leadActivity.findMany({
    where: { leadId },
    orderBy: { createdAt: "desc" },
    include: {
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
};
