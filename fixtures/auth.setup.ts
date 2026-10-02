import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { STORAGE_STATE } from './storageState';
import { env } from '../env';

setup('authenticate', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.setUserName(env.standardUser);
    await loginPage.setPassword(env.password);
    await loginPage.clickLogin();
    await expect(page).toHaveURL(/inventory\.html/);

    await page.context().storageState({ path: STORAGE_STATE });
});
