import { Page, Locator } from "@playwright/test";

export class InventoryPage {
    public readonly page: Page;

    public constructor(page: Page) {
        this.page = page;
    }
}