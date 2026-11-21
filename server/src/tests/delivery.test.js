import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../app.js';

describe('Full-stack delivery test', () => {
  test('GET / should serve React SPA index.html', async () => {
    const res = await request(app).get('/');
    assert.equal(res.status, 200);
    assert.ok(res.text.includes('id="root"'));
    assert.ok(res.text.includes('Lead Manager'));
  });

  test('GET /api/leads should return JSON API response', async () => {
    const res = await request(app).get('/api/leads');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });
});
