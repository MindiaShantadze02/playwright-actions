import { test, expect } from '@playwright/test';

test.describe('DummyJSON products API', () => {
    test('GET a single product by id', { tag: ['@api', '@smoke', '@regression'] }, async ({ request }) => {
        const response = await request.get('/products/1');

        expect(response.status()).toBe(200);
        const product = await response.json();
        expect(product).toMatchObject({ id: 1, title: expect.any(String), price: expect.any(Number) });
    });

    test('GET products with pagination', { tag: ['@api', '@regression'] }, async ({ request }) => {
        const response = await request.get('/products', { params: { limit: 5, skip: 10 } });

        expect(response.ok()).toBeTruthy();
        const body = await response.json();
        expect(body.products).toHaveLength(5);
        expect(body.products[0].id).toBe(11);
        expect(body).toMatchObject({ skip: 10, limit: 5 });
    });

    test('Search products by keyword', { tag: ['@api', '@regression'] }, async ({ request }) => {
        const response = await request.get('/products/search', { params: { q: 'phone' } });

        expect(response.ok()).toBeTruthy();
        const { products } = await response.json();
        expect(products.length).toBeGreaterThan(0);
        for (const product of products) {
            expect(JSON.stringify(product).toLowerCase()).toContain('phone');
        }
    });

    test('POST a new product', { tag: ['@api', '@regression'] }, async ({ request }) => {
        // DummyJSON simulates writes: the response echoes the product but nothing is persisted
        const response = await request.post('/products/add', {
            data: { title: 'Playwright Test Product', price: 42 },
        });

        expect(response.status()).toBe(201);
        const product = await response.json();
        expect(product).toMatchObject({ id: expect.any(Number), title: 'Playwright Test Product', price: 42 });
    });

    test('PUT updates an existing product', { tag: ['@api', '@regression'] }, async ({ request }) => {
        const response = await request.put('/products/1', { data: { title: 'Updated title' } });

        expect(response.ok()).toBeTruthy();
        expect(await response.json()).toMatchObject({ id: 1, title: 'Updated title' });
    });

    test('DELETE a product', { tag: ['@api', '@regression'] }, async ({ request }) => {
        const response = await request.delete('/products/1');

        expect(response.ok()).toBeTruthy();
        expect(await response.json()).toMatchObject({ id: 1, isDeleted: true });
    });

    test('GET a missing product returns 404', { tag: ['@api', '@regression'] }, async ({ request }) => {
        const response = await request.get('/products/0');

        expect(response.status()).toBe(404);
        expect((await response.json()).message).toContain('not found');
    });
});
