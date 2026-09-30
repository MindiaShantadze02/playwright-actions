import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '.env' ) });

const required = (parameter: string) => {
    const value = process.env[parameter];

    if (!value) {
        throw new Error('Missing environment variable ' + parameter);
    }

    return value;
}

export const env = {
    baseURL: required('BASE_URL'),
    standardUser: required('STANDARD_USER'),
    password: required('PASSWORD')
}