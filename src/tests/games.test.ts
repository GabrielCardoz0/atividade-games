import supertest from "supertest";
import app from "app";
import prisma from "config/database";
import createConsole from "./factories/console-factory";
import { createGame } from "./factories/games-factory";
import { faker } from "@faker-js/faker";

beforeAll(async () => {
    await prisma.game.deleteMany({});
    await prisma.console.deleteMany({});
});

const server = supertest(app);

describe("GET /games", () => {
    it("should respond with empty array", async () => {
        const response = await server.get("/games");

        expect(response.body).toEqual([]);
    })

})

describe("GET /games/:id", () => {

    it("should respond with status 404 when invalid id", async () => {

        const response = await server.get("/games/0");

        expect(response.status).toBe(404);
    })

    it("should respond with status 200 and game if valid id", async () => {
        const console = await createConsole();
        const game = await createGame(console.id);

        const response = await server.get(`/games/${game.id}`);

        expect(response.body).toEqual(game);
    })
})


describe("POST /games", () => {

    it("should respond with status 422 when invalid body", async () => {

        const response = await server.post("/games");

        expect(response.status).toBe(422);
    })

    it("should respond with status 200 if valid body", async () => {
        const console = await createConsole();

        const newGame = {
            title: faker.name.firstName(),
            consoleId: console.id
        }

        const response = await server.post("/games").send(newGame);

        expect(response.status).toBe(200);
    })
})