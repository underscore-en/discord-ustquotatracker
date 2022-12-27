import 'reflect-metadata';
import { config } from 'dotenv';

config();
import { Server } from './server';

// for test cases
export const server = new Server();

export async function startServer() {
    await server.start();
}
