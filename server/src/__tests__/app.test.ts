import request from "supertest";
import app from "../index";
import { Server } from 'http';
import axios from "axios";

let server: Server;

beforeAll((done) => {
  server = app.listen(0, done);
});

afterAll((done) => {
  server.close(done);
});

describe('GET /balance-sheet', () => {
  it('should return 200 OK', async () => {
    const response = await request(app).get('/balance-sheet');
    expect(response.status).toBe(200);
  });

  it('should return JSON', async () => {
    const response = await request(app).get('/balance-sheet');
    expect(response.headers['content-type']).toMatch(/json/);
  });

  it('should return 500 and error message when external API fails', async () => {
    jest.spyOn(axios, 'get').mockRejectedValueOnce(new Error('API failed'));
    const response = await request(app).get('/balance-sheet');
    expect(response.status).toBe(500);
    expect(response.text).toBe('Error fetching balance sheet data');
  });
  it('should return a valid balance sheet structure', async () => {
    const response = await request(app).get('/balance-sheet');
    expect(response.body).toMatchObject({
      Status: expect.any(String),
      Reports: expect.any(Array),
    });
  });
});