import path from 'path';

// Session saved by auth.setup.ts and loaded by the browser projects
export const STORAGE_STATE = path.join(__dirname, '../playwright/.auth/saucedemo.json');
