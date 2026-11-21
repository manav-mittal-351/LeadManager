import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

describe('Leads API Endpoints', () => {
  let createdLeadId = null;

  test('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
  });

  test('GET /api/leads should return list of leads and pagination', async () => {
    const res = await request(app).get('/api/leads');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.pagination);
    assert.ok(res.body.pagination.total >= 0);
  });

  test('GET /api/leads/stats should return counts per status', async () => {
    const res = await request(app).get('/api/leads/stats');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(typeof res.body.data.total, 'number');
    assert.equal(typeof res.body.data.new, 'number');
    assert.equal(typeof res.body.data.contacted, 'number');
    assert.equal(typeof res.body.data.qualified, 'number');
    assert.equal(typeof res.body.data.lost, 'number');
  });

  test('POST /api/leads should create a new lead when payload is valid', async () => {
    const newLead = {
      name: 'Rohan Gupta',
      email: 'rohan.gupta@enterprise.org',
      phone: '+91 99001 12233',
      company: 'Enterprise Org',
      source: 'Website',
      status: 'New',
      notes: 'Interested in annual subscription',
    };

    const res = await request(app)
      .post('/api/leads')
      .send(newLead);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.name, 'Rohan Gupta');
    assert.equal(res.body.data.email, 'rohan.gupta@enterprise.org');
    assert.equal(res.body.data.status, 'New');

    createdLeadId = res.body.data.id;
  });

  test('POST /api/leads should reject with 400 when name is missing', async () => {
    const invalidLead = {
      email: 'noname@test.com',
      source: 'Website',
      status: 'New',
    };

    const res = await request(app)
      .post('/api/leads')
      .send(invalidLead);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.name);
  });

  test('POST /api/leads should reject with 400 when email is invalid', async () => {
    const invalidLead = {
      name: 'Valid Name',
      email: 'not-an-email',
      source: 'Website',
      status: 'New',
    };

    const res = await request(app)
      .post('/api/leads')
      .send(invalidLead);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.email);
  });

  test('POST /api/leads should reject with 400 when status is invalid', async () => {
    const invalidLead = {
      name: 'Valid Name',
      email: 'test@example.com',
      source: 'Website',
      status: 'InvalidStatus',
    };

    const res = await request(app)
      .post('/api/leads')
      .send(invalidLead);

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.errors.status);
  });

  test('GET /api/leads/:id should retrieve the created lead', async () => {
    assert.ok(createdLeadId);
    const res = await request(app).get(`/api/leads/${createdLeadId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, createdLeadId);
    assert.equal(res.body.data.name, 'Rohan Gupta');
  });

  test('GET /api/leads/:id should return 404 for non-existent id', async () => {
    const res = await request(app).get('/api/leads/999999');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
  });

  test('PUT /api/leads/:id should update an existing lead and its status', async () => {
    assert.ok(createdLeadId);
    const updatePayload = {
      name: 'Rohan Gupta Updated',
      email: 'rohan.gupta@enterprise.org',
      phone: '+91 99001 12233',
      company: 'Enterprise Org Global',
      source: 'Website',
      status: 'Qualified',
      notes: 'Demo completed, moving to proposal',
    };

    const res = await request(app)
      .put(`/api/leads/${createdLeadId}`)
      .send(updatePayload);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'Qualified');
    assert.equal(res.body.data.company, 'Enterprise Org Global');
  });

  test('GET /api/leads with search query should filter by name', async () => {
    const res = await request(app).get('/api/leads?search=Rohan');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length > 0);
    assert.ok(res.body.data.some(l => l.name.includes('Rohan')));
  });

  test('GET /api/leads with status filter should only return matching status', async () => {
    const res = await request(app).get('/api/leads?status=Qualified');
    assert.equal(res.status, 200);
    for (const lead of res.body.data) {
      assert.equal(lead.status, 'Qualified');
    }
  });

  test('DELETE /api/leads/:id should delete the lead', async () => {
    assert.ok(createdLeadId);
    const res = await request(app).delete(`/api/leads/${createdLeadId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);

    // Verify it is gone
    const verifyRes = await request(app).get(`/api/leads/${createdLeadId}`);
    assert.equal(verifyRes.status, 404);
  });
});
