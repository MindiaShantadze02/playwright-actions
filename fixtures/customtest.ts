import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

type Fixtures = {
    loginPage: LoginPage,
    inventoryPage: InventoryPage
}

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        const loginPage: LoginPage = new LoginPage(page);
        await use(loginPage);
    },
    inventoryPage: async ({ page }, use) => {
        const inventoryPage: InventoryPage = new InventoryPage(page);
        await use(inventoryPage);
    }
});