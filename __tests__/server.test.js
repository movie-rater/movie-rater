const { db } = require('../src/models/modelIndex');
const supertest = require('supertest');
const server = require('../src/server');
const request = supertest(server.server);

let token = null;

beforeAll(async () => {
  await db.sync();
  let res = await request.post('/signup').send({
    username: 'test',
    password: 'test',
    role: 'admin',
  });
  token = res.body.token;
  await request.post('/api/v2/clothes').set('Authorization', 'bearer ' + token).send({
    "name": "1st",
    "color": "sdfsdf",
    "size": "werwerwer"
})});
afterAll(async () => {
  await db.drop();
});

// V1 (Unauthenticated API) routes:
test('POST /api/v1/food adds an item to the DB and returns an object with the added item', async () => {
  let response = await request.post('/api/v1/food').send({
      "name": "apple",
      "calories": 23423,
      "type": "fruit"
  });
  expect(response.status).toEqual(201);
  expect(response.body.name).toEqual('apple');
});

test('GET /api/v1/food returns a list of :model items', async () => {
  let response = await request.get('/api/v1/food');
  expect(response.status).toEqual(200);
});

test('GET /api/v1/:model/ID returns a single item by ID.', async () => {
  let response = await request.get('/api/v1/food/1');
  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual('apple');
});

test('PUT /api/v1/:model/ID returns a single, updated item by ID.', async () => {
  let obj = {
    "name": "orange",
    "calories": 43534,
    "type": "fruit"
  }
  let response = await request.put('/api/v1/food/1').send(obj);
  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual('orange');
});

test('DELETE /api/v1/:model/ID returns an empty object. Subsequent GET for the same ID should result in nothing found.', async () => {
  let response = await request.delete('/api/v1/food/1');
  expect(response.status).toEqual(200);
  expect(response.body.name).not.toBeTruthy;
});



// V2 (Authenticated API) routes:
test('POST /api/v2/:model with a bearer token that has create permissions adds an item to the DB and returns an object with the added item.', async () => {
  let response = await request.post('/api/v2/clothes').set('Authorization', 'bearer ' + token).send({
      "name": "ba",
      "color": "ba",
      "size": "ba"
  }
  );
  expect(response.status).toEqual(201);
  expect(response.body.name).toEqual('ba');
});

test('GET /api/v2/:model with a bearer token that has read permissions returns a list of :model items.', async () => {
  let response = await request.get('/api/v2/clothes').set('Authorization', 'bearer ' + token);
  expect(response.status).toEqual(200);
});

test('GET /api/v2/:model/ID with a bearer token that has read permissions returns a single item by ID.', async () => {
  let response = await request.get('/api/v2/clothes/2').set('Authorization', 'bearer ' + token);
  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual('ba');
});

test('PUT /api/v2/:model/ID with a bearer token that has update permissions returns a single, updated item by ID.', async () => {
  let obj = {
    "name": "ab",
    "color": "ab",
    "size": "aa"
  }
  let response = await request.put('/api/v2/clothes/2').set('Authorization', 'bearer ' + token).send(obj);
  expect(response.status).toEqual(200);
  expect(response.body.name).toEqual('ab');
});

test('DELETE /api/v2/:model/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found.', async () => {
  let response = await request.delete('/api/v2/clothes/2').set('Authorization', 'bearer ' + token);
  expect(response.status).toEqual(200);
  expect(response.body.name).not.toBeTruthy;
});
