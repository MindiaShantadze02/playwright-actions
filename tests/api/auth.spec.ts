import { test, expect } from '@playwright/test';

// Public demo credentials documented at https://dummyjson.com/docs/auth
const credentials = { username: 'emilys', password: 'emilyspass' };

test.describe('DummyJSON auth API', () => {
    test('Login returns tokens and the token works on /auth/me', { tag: ['@api', '@smoke', '@regression'] }, async ({ request }) => {
        const loginResponse = await request.post('/auth/login', { data: credentials });

        expect(loginResponse.status()).toBe(200);
        const { accessToken, username } = await loginResponse.json();
        expect(accessToken).toBeTruthy();
        expect(username).toBe(credentials.username);

        const meResponse = await request.get('/auth/me', {
            headers: { Authorization: `Bearer ${accessToken}` },
        });

        expect(meResponse.ok()).toBeTruthy();
        expect(await meResponse.json()).toMatchObject({ username: credentials.username });
    });

    test('Login with wrong password is rejected', { tag: ['@api', '@regression'] }, async ({ request }) => {
        const response = await request.post('/auth/login', {
            data: { username: credentials.username, password: 'wrong' },
        });

        expect(response.status()).toBe(400);
        expect((await response.json()).message).toBe('Invalid credentials');
    });

    test('/auth/me without a token is unauthorized', { tag: ['@api', '@smoke'] }, async ({ request }) => {
        const response = await request.get('/auth/me');
        
        // deliberately failing this test to check the artifacts in CI
        expect(response.status()).toBe(200);
    });
});
