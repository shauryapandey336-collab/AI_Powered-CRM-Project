import { parse } from "csv-parse/sync";
import { prisma } from "../config/database.js";

export const processCsvImport = async (fileBuffer, organizationId, createdById) => {
  const records = parse(fileBuffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  let totalRows = records.length;
  let imported = 0;
  let duplicates = 0;
  let invalid = 0;

  const existingLeads = await prisma.lead.findMany({
    where: { organizationId },
    select: { email: true }
  });

  const existingEmails = new Set(existingLeads.map((l) => l.email.toLowerCase()));

  const leadsToCreate = [];

  for (const record of records) {
    const firstName = record.firstName || record["First Name"] || record.first_name || record.name;
    const lastName = record.lastName || record["Last Name"] || record.last_name || "";
    const email = record.email || record["Email"] || record.Email;

    if (!firstName || !email || !email.includes("@")) {
      invalid++;
      continue;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (existingEmails.has(normalizedEmail)) {
      duplicates++;
      continue;
    }

    existingEmails.add(normalizedEmail);

    leadsToCreate.push({
      organizationId,
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : null,
      email: normalizedEmail,
      phone: record.phone || record["Phone"] || null,
      company: record.company || record["Company"] || null,
      jobTitle: record.jobTitle || record["Job Title"] || record.title || null,
      notes: record.notes || record["Notes"] || null,
      source: "CSV",
      status: "NEW"
    });
  }

  if (leadsToCreate.length > 0) {
    await prisma.$transaction(async (tx) => {
      await tx.lead.createMany({
        data: leadsToCreate
      });

      imported = leadsToCreate.length;

      const createdLeads = await tx.lead.findMany({
        where: {
          organizationId,
          email: { in: leadsToCreate.map((l) => l.email) }
        },
        select: { id: true }
      });

      const activities = createdLeads.map((lead) => ({
        leadId: lead.id,
        createdById,
        type: "NOTE",
        description: "Lead imported via CSV batch upload"
      }));

      if (activities.length > 0) {
        await tx.leadActivity.createMany({
          data: activities
        });
      }
    });
  }

  return {
    totalRows,
    imported,
    duplicates,
    invalid
  };
};
