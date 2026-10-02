import { test as teardown } from '@playwright/test';
import fs from 'fs';
import { STORAGE_STATE } from './storageState';

teardown('remove saved session', async () => {
    fs.rmSync(STORAGE_STATE, { force: true });
});
