const { MongoClient } = require('mongodb');
const request = require('supertest');
const app = require('../src/app');

describe('POST api/auth/register', () => {
        let db;
        let connection;

        beforeAll(async () => {
            connection = await MongoClient.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
              });

              db = await connection.db(process.env.MONGO_DB_NAME);
              await db.dropDatabase();
        })

        afterAll(async () => {
            await connection.close();
          });

        test('should respond with a status code 201', async () => {
            const response = await request(app).post('/api/auth/register').send({
                firstname: 'testfirstname',
                lastname: 'testlastname',
                email: 'test@email.com',
                institution: 'testinstitution',
                faculty: 'testfaculty',
                phone_number: '09014206750',
                password: 'testpassword'
            });
    
            expect(response.statusCode).toBe(201)
        })
})
