import { test } from '../fixtures/customtest';
import { expect } from '@playwright/test';
import { env } from '../env';

test.describe('Login suite', () => {
    // Opt out of the saved session: this suite tests logging in itself
    test.use({ storageState: { cookies: [], origins: [] } });

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.goto();
    });

    test('Verify that correct user is able to login into the inventory', { tag: ['@smoke', '@regression'] } ,async ({ loginPage, inventoryPage }) => {
        await loginPage.setUserName(env.standardUser);
        await loginPage.setPassword(env.password);
        await loginPage.clickLogin();
        await expect(inventoryPage.page).toHaveURL(/inventory\.html/)
    });

    test('Verify that locked out user cannot login', { tag: ['@regression'] }, async ({ loginPage }) => {
        await loginPage.setUserName('locked_out_user');
        await loginPage.setPassword(env.password);
        await loginPage.clickLogin();
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    });

    test('Verify that wrong password shows an error', { tag: ['@regression'] }, async ({ loginPage }) => {
        await loginPage.setUserName(env.standardUser);
        await loginPage.setPassword('wrong_password');
        await loginPage.clickLogin();
        await expect(loginPage.errorMessage).toContainText('Username and password do not match');
    });

    test('Verify that empty username shows an error', { tag: ['@regression'] }, async ({ loginPage }) => {
        await loginPage.clickLogin();
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Username is required');
    });

    test('Verify that empty password shows an error', { tag: ['@regression'] }, async ({ loginPage }) => {
        await loginPage.setUserName(env.standardUser);
        await loginPage.clickLogin();
        await expect(loginPage.errorMessage).toHaveText('Epic sadface: Password is required');
    });
});
