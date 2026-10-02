import { test } from '../fixtures/customtest';
import { expect } from '@playwright/test';

// Starts already logged in: the 'setup' project saves the session and the browser projects load it
test.describe('Inventory suite', () => {
    test.beforeEach(async ({ inventoryPage }) => {
        await inventoryPage.goto();
    });

    test('Logged-in user lands directly on the inventory', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage }) => {
        await expect(inventoryPage.page).toHaveURL(/inventory\.html/);
        await expect(inventoryPage.title).toHaveText('Products');
        await expect(inventoryPage.items).toHaveCount(6);
    });

    test('Adding an item updates the cart badge', { tag: ['@smoke', '@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await expect(inventoryPage.cartBadge).toHaveText('1');
    });

    test('Adding several items counts them all', { tag: ['@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.addToCart('Sauce Labs Backpack');
        await inventoryPage.addToCart('Sauce Labs Bike Light');
        await inventoryPage.addToCart('Sauce Labs Onesie');
        await expect(inventoryPage.cartBadge).toHaveText('3');
    });

    test('Sort by price low to high', { tag: ['@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.sortBy('lohi');
        const prices = await inventoryPage.getPrices();
        expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });

    test('Sort by price high to low', { tag: ['@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.sortBy('hilo');
        const prices = await inventoryPage.getPrices();
        expect(prices).toEqual([...prices].sort((a, b) => b - a));
    });

    test('Sort by name Z to A', { tag: ['@regression'] }, async ({ inventoryPage }) => {
        await inventoryPage.sortBy('za');
        const names = await inventoryPage.itemNames.allTextContents();
        expect(names).toEqual([...names].sort().reverse());
    });
});
