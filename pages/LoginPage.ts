import { Page, Locator } from "@playwright/test";

export class LoginPage {
    public readonly page: Page;

    private readonly loginInput: Locator;
    private readonly passwordInput: Locator;
    private readonly loginButton: Locator;
    public readonly errorMessage: Locator;

    public constructor(page: Page) {
        this.page = page;
        this.loginInput = page.getByRole('textbox', { 'name': 'Username' });
        this.passwordInput = page.getByRole('textbox', { 'name': 'Password' });
        this.loginButton = page.getByRole('button', { 'name': 'Login' });
        this.errorMessage = page.locator('[data-test="error"]');
    }

    public async goto(): Promise<void> {
        await this.page.goto('/');
    }

    public setUserName(userName: string): Promise<void> {
        return this.loginInput.fill(userName);
    }

    public setPassword(password: string): Promise<void> {
        return this.passwordInput.fill(password);
    }

    public clickLogin(): Promise<void> {
        return this.loginButton.click();
    }
}