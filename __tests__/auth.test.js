'use strict';

// process.env.SECRET = "TEST_SECRET";

const { db } = require('../src/models/modelIndex');
const supertest = require('supertest');
const server  = require('../src/server');
const request = supertest(server.server);

beforeAll(async () => {
  await db.sync();
});
afterAll(async () => {
  await db.drop();
});


test('POST /signup creates a new user and sends an object with the user and the token to the client.', async () => {
  let response = await request.post('/signup').send({
    username: 'asd',
    password: 'asd',

  });
  expect(response.status).toEqual(201);
  expect(response.body.user.username).toEqual('asd');
  expect(response.body.token).toBeTruthy();
});

test('POST /signin with basic authentication headers logs in a user and sends an object with the user and the token to the client.', async () => {
  let response = await request.post('/signin').auth('asd','asd');
  expect(response.status).toEqual(200);
  expect(response.body.user.username).toEqual('asd');
  expect(response.body.token).toBeTruthy();
});

