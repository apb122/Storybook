const fetch = require('node-fetch'); // You might need to install node-fetch if not available, or use native fetch in Node 18+

const BASE_URL = 'http://localhost:3000/api/auth';

async function testAuth() {
  console.log('Testing Auth API...');

  // 1. Signup
  console.log('\n1. Testing Signup...');
  const signupRes = await fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
    }),
  });
  const signupData = await signupRes.json();
  console.log('Signup Status:', signupRes.status);
  console.log('Signup Data:', signupData);

  if (!signupRes.ok) {
    console.error('Signup failed');
    return;
  }

  const token = signupData.token;

  // 2. Login
  console.log('\n2. Testing Login...');
  const loginRes = await fetch(`${BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: signupData.user.email,
      password: 'password123',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login Status:', loginRes.status);
  console.log('Login Data:', loginData);

  // 3. Me (Protected)
  console.log('\n3. Testing Protected Route (/me)...');
  const meRes = await fetch(`${BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const meData = await meRes.json();
  console.log('Me Status:', meRes.status);
  console.log('Me Data:', meData);
}

testAuth().catch(console.error);
