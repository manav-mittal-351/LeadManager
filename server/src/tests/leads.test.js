import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app.js';
import Lead from '../models/Lead.js';
import { connectDB } from '../config/db.js';

describe('Lead Manager API Tests (MongoDB)', () => {
  let createdLeadId = null;
  let isMongoConnected = false;

  before(async () => {
    try {
      await connectDB();
      isMongoConnected = mongoose.connection.readyState === 1;
    } catch {
      isMongoConnected = false;
    }

    // If MongoDB is not connected (e.g. pending Atlas credentials or offline),
    // provide an in-memory mock so tests can verify the API contract and validation
    if (!isMongoConnected) {
      const mockStorage = [];

      Lead.find = (filter = {}) => ({
        sort: () => {
          let results = [...mockStorage];
          if (filter.name && filter.name.$regex) {
            const re = new RegExp(filter.name.$regex, filter.name.$options || '');
            results = results.filter((l) => re.test(l.name));
          }
          if (filter.status) {
            results = results.filter((l) => l.status === filter.status);
          }
          return Promise.resolve(results);
        },
      });

      Lead.findById = (id) => {
        const item = mockStorage.find((l) => l.id === id || l._id === id);
        return Promise.resolve(item || null);
      };

      Lead.create = (doc) => {
        const id = '654321' + Math.random().toString(36).substring(2, 8);
        const item = { ...doc, id, _id: id, createdAt: new Date() };
        mockStorage.push(item);
        return Promise.resolve(item);
      };

      Lead.findByIdAndUpdate = (id, update) => {
        const index = mockStorage.findIndex((l) => l.id === id || l._id === id);
        if (index === -1) return Promise.resolve(null);
        mockStorage[index] = { ...mockStorage[index], ...update };
        return Promise.resolve(mockStorage[index]);
      };

      Lead.findByIdAndDelete = (id) => {
        const index = mockStorage.findIndex((l) => l.id === id || l._id === id);
        if (index === -1) return Promise.resolve(null);
        const [deleted] = mockStorage.splice(index, 1);
        return Promise.resolve(deleted);
      };
    }
  });

  after(async () => {
    if (isMongoConnected) {
      await mongoose.disconnect();
    }
  });

  test('GET /api/health returns 200 OK', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  test('GET /api/leads returns all leads', async () => {
    const res = await request(app).get('/api/leads');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('POST /api/leads creates a lead with valid data', async () => {
    const payload = {
      name: 'Rohan Gupta',
      email: 'rohan.gupta@enterprise.org',
      phone: '+91 99001 12233',
      company: 'Enterprise Org',
      source: 'Website',
      status: 'New',
    };

    const res = await request(app).post('/api/leads').send(payload);
    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id || res.body.data._id);
    assert.equal(res.body.data.name, 'Rohan Gupta');
    assert.equal(res.body.data.email, 'rohan.gupta@enterprise.org');
    assert.equal(res.body.data.status, 'New');

    createdLeadId = res.body.data.id || res.body.data._id;
  });

  test('POST /api/leads validates required name', async () => {
    const res = await request(app).post('/api/leads').send({
      email: 'valid@email.com',
      source: 'Website',
      status: 'New',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.name);
  });

  test('POST /api/leads validates email format', async () => {
    const res = await request(app).post('/api/leads').send({
      name: 'Test Lead',
      email: 'invalid-email',
      source: 'Website',
      status: 'New',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.email);
  });

  test('POST /api/leads validates status enum', async () => {
    const res = await request(app).post('/api/leads').send({
      name: 'Test Lead',
      email: 'lead@test.com',
      source: 'Website',
      status: 'InvalidStatus',
    });
    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.status);
  });

  test('GET /api/leads/:id returns single lead', async () => {
    assert.ok(createdLeadId);
    const res = await request(app).get(`/api/leads/${createdLeadId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id || res.body.data._id, createdLeadId);
    assert.equal(res.body.data.name, 'Rohan Gupta');
  });

  test('GET /api/leads/:id returns 404 for unknown id', async () => {
    const res = await request(app).get('/api/leads/654321abcdef0123456789aa');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  test('PUT /api/leads/:id updates lead details and status', async () => {
    assert.ok(createdLeadId);
    const updatePayload = {
      name: 'Rohan Gupta Updated',
      email: 'rohan.gupta@enterprise.org',
      phone: '+91 99001 12233',
      company: 'Enterprise Org Global',
      source: 'Website',
      status: 'Qualified',
    };

    const res = await request(app)
      .put(`/api/leads/${createdLeadId}`)
      .send(updatePayload);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'Qualified');
    assert.equal(res.body.data.name, 'Rohan Gupta Updated');
  });

  test('GET /api/leads?search= filters leads by name only', async () => {
    const res = await request(app).get('/api/leads?search=Rohan');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.every((l) => l.name.toLowerCase().includes('rohan')));
  });

  test('GET /api/leads?status= filters leads by status only', async () => {
    const res = await request(app).get('/api/leads?status=Qualified');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.every((l) => l.status === 'Qualified'));
  });

  test('DELETE /api/leads/:id deletes the lead', async () => {
    assert.ok(createdLeadId);
    const res = await request(app).delete(`/api/leads/${createdLeadId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    const verifyRes = await request(app).get(`/api/leads/${createdLeadId}`);
    assert.equal(verifyRes.status, 404);
  });
});
