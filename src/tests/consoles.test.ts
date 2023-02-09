import supertest from "supertest";
import app from "app";
import prisma from "config/database";
import createConsole from "./factories/console-factory";

beforeAll(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /consoles", () => {
    it("should respond with empty array", async () => {
        const response = await server.get("/consoles");

        expect(response.body).toEqual([]);
    });

    it("should respond with array", async () => {
        const response = await server.get("/consoles");

        await createConsole();

        expect(response.body).toHaveLength(1);
    });
    
})

describe("GET /consoles/id", () => {
    it("should respond with status 404 if invalid id ", async () => {
        const response = await server.get("/consoles/0");

        expect(response.status).toBe(404);
    });

    it("should respond with console object if valid id", async () => {
        const console = await createConsole();

        const response = await server.get(`/consoles/${console.id}`);

        expect(response.body).toEqual({
            id: expect.any(Number),
            name: expect.any(String)
        });

    });
})


describe("POST /consoles", () => {
    it("should respond with status 422 if invalid id ", async () => {

        const response = await server.post("/consoles");

        expect(response.status).toBe(422);
    });

    it("should respond with status 409 if consoles already exist", async () => {
        const console = await createConsole();

        const response = await server.post("/consoles").send({name: console.name});

        expect(response.status).toBe(409);

    });
})