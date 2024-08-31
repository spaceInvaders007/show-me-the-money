"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
const axios_1 = __importDefault(require("axios"));
let server;
beforeAll((done) => {
    server = index_1.default.listen(0, done);
});
afterAll((done) => {
    server.close(done);
});
describe('GET /balance-sheet', () => {
    it('should return 200 OK', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/balance-sheet');
        expect(response.status).toBe(200);
    });
    it('should return JSON', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/balance-sheet');
        expect(response.headers['content-type']).toMatch(/json/);
    });
    it('should return 500 and error message when external API fails', async () => {
        jest.spyOn(axios_1.default, 'get').mockRejectedValueOnce(new Error('API failed'));
        const response = await (0, supertest_1.default)(index_1.default).get('/balance-sheet');
        expect(response.status).toBe(500);
        expect(response.text).toBe('Error fetching balance sheet data');
    });
    it('should return a valid balance sheet structure', async () => {
        const response = await (0, supertest_1.default)(index_1.default).get('/balance-sheet');
        expect(response.body).toMatchObject({
            Status: expect.any(String),
            Reports: expect.any(Array),
        });
    });
});
