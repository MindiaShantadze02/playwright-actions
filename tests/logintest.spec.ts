import { test } from '../fixtures/customtest';
import { expect } from '@playwright/test';
import { env } from '../env';

test.describe('Login suite', () => {
    test('Verify that correct user is able to login into the inventory', async ({ loginPage, inventoryPage }) => {
        await loginPage.goto();
        await loginPage.setUserName(env.standardUser);
        await loginPage.setPassword(env.password);
        await loginPage.clickLogin();
        await expect(inventoryPage.page).toHaveURL(/inventory\.html/)
    });
});