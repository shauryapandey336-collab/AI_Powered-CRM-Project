import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";

const generateToken = (userId, organizationId) => {
  return jwt.sign({ userId, organizationId }, env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

export const registerUser = async ({ organizationName, name, email, password }) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: email.toLowerCase() }
  });

  if (existingUser) {
    const error = new Error("Email address is already registered");
    error.statusCode = 400;
    throw error;
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const result = await prisma.$transaction(async (tx) => {
    const organization = await tx.organization.create({
      data: {
        name: organizationName
      }
    });

    const user = await tx.user.create({
      data: {
        organizationId: organization.id,
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: "ADMIN"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        organizationId: true,
        organization: {
          select: {
            id: true,
            name: true
          }
        },
        createdAt: true
      }
    });

    return user;
  });

  const token = generateToken(result.id, result.organizationId);

  return { user: result, token };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
    include: {
      organization: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user.id, user.organizationId);

  const { passwordHash, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
};

export const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      organizationId: true,
      organization: {
        select: {
          id: true,
          name: true
        }
      },
      createdAt: true
    }
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};
