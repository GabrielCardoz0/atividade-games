import { faker } from "@faker-js/faker";
import prisma from "config/database";

export default async function createConsole() {
    return prisma.console.create({
        data: {
            name: faker.name.firstName()
        }
    });
}