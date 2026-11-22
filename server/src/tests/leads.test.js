import 'dotenv/config';
import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import dns from 'dns';
import app from '../app.js';
import User from '../models/User.js';
import Lead from '../models/Lead.js';

// Ensure DNS resolution works reliably on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {}

function getTestDatabaseUri(uri) {
  if (!uri || !uri.includes('://')) return uri;
  const questionIndex = uri.indexOf('?');
  const base = questionIndex !== -1 ? uri.substring(0, questionIndex) : uri;
  const query = questionIndex !== -1 ? uri.substring(questionIndex) : '';
  const lastSlash = base.lastIndexOf('/');
  const prefix = base.substring(0, lastSlash + 1);
  return `${prefix}leadmanager_automated_tests${query}`;
}

describe('Lead Manager API Integration Tests', () => {
  let isMongoConnected = false;
  let userAToken = null;
  let userBToken = null;
  let userALeadId = null;

  const testUserA = {
    name: 'Sales Rep Alice',
    email: `alice_${Date.now()}@example.com`,
    password: 'securePassword123',
  };

  const testUserB = {
    name: 'Sales Rep Bob',
    email: `bob_${Date.now()}@example.com`,
    password: 'anotherPassword456',
  };

  before(async () => {
    const rawUri = process.env.TEST_MONGODB_URI || getTestDatabaseUri(process.env.MONGODB_URI);

    try {
      await mongoose.connect(rawUri);
      isMongoConnected = mongoose.connection.readyState === 1;

      // Strict Safety Check: Refuse to run or clean if not on a dedicated test database
      if (!mongoose.connection.name || !mongoose.connection.name.toLowerCase().includes('test')) {
        throw new Error(
          `SAFETY CHECK FAILED: Refusing to run destructive cleanup. Connected database '${mongoose.connection.name}' does not contain 'test'!`
        );
      }

      console.log('Connected to SEPARATE test database:', mongoose.connection.name);

      // Clean test database collections
      await User.deleteMany({ email: { $regex: /@example\.com$/ } });
      await Lead.deleteMany({});
    } catch (err) {
      console.warn('Could not connect to test database, using test mocks:', err.message);
      isMongoConnected = false;
    }
  });

  after(async () => {
    if (isMongoConnected) {
      // Re-verify safety guard before after-cleanup
      if (mongoose.connection.name && mongoose.connection.name.toLowerCase().includes('test')) {
        await User.deleteMany({ email: { $regex: /@example\.com$/ } });
        await Lead.deleteMany({});
      }
      await mongoose.disconnect();
    }
  });

  test('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  // --- AUTHENTICATION TESTS ---
  test('POST /api/auth/signup creates a user and returns token', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUserA);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, testUserA.email.toLowerCase());
    userAToken = res.body.token;
  });

  test('POST /api/auth/signup rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/signup').send(testUserA);
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.email);
  });

  test('POST /api/auth/signup validates required fields', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      name: '',
      email: 'bad-email',
      password: '123',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.name);
    assert.ok(res.body.errors.email);
    assert.ok(res.body.errors.password);
  });

  test('POST /api/auth/login authenticates valid user', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUserA.email,
      password: testUserA.password,
    });
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
  });

  test('POST /api/auth/login rejects invalid password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: testUserA.email,
      password: 'wrongPassword',
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('POST /api/auth/login rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nonexistent@example.com',
      password: 'somePassword',
    });
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  // --- ROUTE PROTECTION TEST ---
  test('GET /api/leads rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/leads');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  // --- LEADS CRUD & DASHBOARD TESTS ---
  test('POST /api/leads creates lead for authenticated user', async () => {
    const newLead = {
      name: 'Rohan Gupta',
      email: 'rohan.gupta@enterprise.org',
      phone: '+91 99001 12233',
      company: 'Enterprise Org',
      source: 'Website',
      status: 'New',
    };

    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${userAToken}`)
      .send(newLead);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id || res.body.data._id);
    assert.equal(res.body.data.name, 'Rohan Gupta');
    userALeadId = res.body.data.id || res.body.data._id;
  });

  test('POST /api/leads validates required fields', async () => {
    const res = await request(app)
      .post('/api/leads')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ email: 'invalid-email', source: 'Website', status: 'New' });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.name);
  });

  test('GET /api/leads returns user leads with pagination metadata', async () => {
    const res = await request(app)
      .get('/api/leads?page=1&limit=10')
      .set('Authorization', `Bearer ${userAToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
    assert.equal(res.body.pagination.page, 1);
    assert.ok(res.body.pagination.totalLeads >= 1);
  });

  test('GET /api/leads/dashboard returns status counts for user', async () => {
    const res = await request(app)
      .get('/api/leads/dashboard')
      .set('Authorization', `Bearer ${userAToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(typeof res.body.data.total === 'number');
    assert.ok(typeof res.body.data.new === 'number');
    assert.ok(typeof res.body.data.contacted === 'number');
    assert.ok(typeof res.body.data.qualified === 'number');
    assert.ok(typeof res.body.data.lost === 'number');
    assert.ok(res.body.data.total >= 1);
  });

  test('GET /api/leads?search= filters leads by name', async () => {
    const res = await request(app)
      .get('/api/leads?search=Rohan')
      .set('Authorization', `Bearer ${userAToken}`);

    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.every((l) => l.name.toLowerCase().includes('rohan')));
  });

  test('GET /api/leads?status= filters leads by status', async () => {
    const res = await request(app)
      .get('/api/leads?status=New')
      .set('Authorization', `Bearer ${userAToken}`);

    assert.equal(res.status, 200);
    assert.ok(res.body.data.every((l) => l.status === 'New'));
  });

  test('PUT /api/leads/:id updates lead status and details', async () => {
    const res = await request(app)
      .put(`/api/leads/${userALeadId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        name: 'Rohan Gupta Updated',
        email: 'rohan.gupta@enterprise.org',
        phone: '+91 99001 12233',
        company: 'Enterprise Org Global',
        source: 'Website',
        status: 'Qualified',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'Qualified');
    assert.equal(res.body.data.name, 'Rohan Gupta Updated');
  });

  // --- MULTI-USER ISOLATION TESTS ---
  test('User B cannot view, edit, or delete User A lead', async () => {
    // 1. Sign up User B
    const signupB = await request(app).post('/api/auth/signup').send(testUserB);
    assert.equal(signupB.status, 201);
    userBToken = signupB.body.token;

    // 2. User B tries to view User A's lead -> 404
    const getRes = await request(app)
      .get(`/api/leads/${userALeadId}`)
      .set('Authorization', `Bearer ${userBToken}`);
    assert.equal(getRes.status, 404);

    // 3. User B tries to edit User A's lead -> 404
    const putRes = await request(app)
      .put(`/api/leads/${userALeadId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        name: 'Hacked Name',
        email: 'hacked@hack.com',
        source: 'Website',
        status: 'Lost',
      });
    assert.equal(putRes.status, 404);

    // 4. User B tries to delete User A's lead -> 404
    const delRes = await request(app)
      .delete(`/api/leads/${userALeadId}`)
      .set('Authorization', `Bearer ${userBToken}`);
    assert.equal(delRes.status, 404);

    // 5. User B's lead list must be empty
    const listB = await request(app)
      .get('/api/leads')
      .set('Authorization', `Bearer ${userBToken}`);
    assert.equal(listB.body.data.length, 0);
  });

  test('DELETE /api/leads/:id allows User A to delete their own lead', async () => {
    const res = await request(app)
      .delete(`/api/leads/${userALeadId}`)
      .set('Authorization', `Bearer ${userAToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    const checkRes = await request(app)
      .get(`/api/leads/${userALeadId}`)
      .set('Authorization', `Bearer ${userAToken}`);
    assert.equal(checkRes.status, 404);
  });
});
