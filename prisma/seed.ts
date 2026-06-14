import "dotenv/config";
import { ServiceStatus, UserRole, UserStatus } from "../app/lib/enums";
import bcrypt from "bcryptjs";
import { services } from "../app/lib/content";
import { prisma } from "../app/lib/prisma";

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);

  const users = [
    {
      email: "admin@earc.org",
      name: "Super Admin",
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      lastActiveAt: new Date(),
    },
    {
      email: "kofi@earc.org",
      name: "Kofi Asante",
      role: UserRole.EDITOR,
      status: UserStatus.ACTIVE,
      lastActiveAt: new Date(),
    },
    {
      email: "amina@earc.org",
      name: "Amina Yusuf",
      role: UserRole.TRAINER,
      status: UserStatus.ACTIVE,
    },
    {
      email: "peter@earc.org",
      name: "Peter Okonkwo",
      role: UserRole.ANALYST,
      status: UserStatus.INACTIVE,
    },
    {
      email: "grace@earc.org",
      name: "Grace Mwangi",
      role: UserRole.EDITOR,
      status: UserStatus.PENDING,
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        name: user.name,
        role: user.role,
        status: user.status,
        lastActiveAt: user.lastActiveAt,
      },
      create: {
        ...user,
        passwordHash,
      },
    });
  }

  for (const [index, service] of services.entries()) {
    await prisma.service.upsert({
      where: { id: service.id },
      update: {
        title: service.title,
        description: service.description,
        note: service.note,
        items: [...service.items],
        sortOrder: index,
        status: ServiceStatus.PUBLISHED,
      },
      create: {
        id: service.id,
        title: service.title,
        description: service.description,
        note: service.note,
        items: [...service.items],
        sortOrder: index,
        status: ServiceStatus.PUBLISHED,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
