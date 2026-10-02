import { Page, Locator } from "@playwright/test";

export class InventoryPage {
    public readonly page: Page;

    public readonly title: Locator;
    public readonly items: Locator;
    public readonly itemNames: Locator;
    public readonly itemPrices: Locator;
    public readonly cartBadge: Locator;
    private readonly sortDropdown: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.title = page.locator('[data-test="title"]');
        this.items = page.locator('[data-test="inventory-item"]');
        this.itemNames = page.locator('[data-test="inventory-item-name"]');
        this.itemPrices = page.locator('[data-test="inventory-item-price"]');
        this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
        this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    }

    public async goto(): Promise<void> {
        await this.page.goto('/inventory.html');
    }

    public async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }

    public async addToCart(itemName: string): Promise<void> {
        await this.items.filter({ hasText: itemName }).getByRole('button', { name: 'Add to cart' }).click();
    }

    public async getPrices(): Promise<number[]> {
        const prices = await this.itemPrices.allTextContents();
        return prices.map(price => Number(price.replace('$', '')));
    }
}
