const { db } = require('../src/models/modelIndex');
const supertest = require('supertest');
const server = require('../src/server');
const request = supertest(server.server);

let token = null;

beforeAll(async () => {
  await db.sync();
  let res = await request.post('/signup').send({
    username: 'bbb',
    password: 'bbb',
    role: 'admin',
  });
  token = res.body.token;
  await request.post('/movies').set('Authorization', 'bearer ' + token).send({
    "title": "matrix",
    "rating": "10"
})});


afterAll(async () => {
  await db.drop();
});


test('POST /movies with a bearer token that has create permissions adds an item to the DB and returns an object with the added item.', async () => {
  let response = await request.post('/movies').set('Authorization', 'bearer ' + token).send({
      "title": "moon",
      "rating": "9"
  }
  );
  expect(response.status).toEqual(201);
  expect(response.body.title).toEqual('moon');
});

test('GET /movies with a bearer token that has read permissions returns a list of :model items.', async () => {
  let response = await request.get('/movies').set('Authorization', 'bearer ' + token);
  expect(response.status).toEqual(200);
});

test('GET /movies/ID with a bearer token that has read permissions returns a single item by ID.', async () => {
  let response = await request.get('/movies/1').set('Authorization', 'bearer ' + token);
  expect(response.status).toEqual(200);
  expect(response.body.title).toEqual('matrix');
});

test('PUT /movies/ID with a bearer token that has update permissions returns a single, updated item by ID.', async () => {
  let obj = {
    "title": "newMovie",
    "rating": "112",
  }
  let response = await request.put('/movies/1').set('Authorization', 'bearer ' + token).send(obj);
  expect(response.status).toEqual(200);
  expect(response.body.rating).toEqual('122');
});

test('DELETE /movies/ID with a bearer token that has delete permissions returns an empty object. Subsequent GET for the same ID should result in nothing found.', async () => {
  let response = await request.delete('/movies/1').set('Authorization', 'bearer ' + token);
  expect(response.status).toEqual(200);
  expect(response.body.title).not.toBeTruthy;
});
