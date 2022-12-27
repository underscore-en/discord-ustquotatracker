import { config } from 'dotenv';
import { server } from './share';

config();

server.start().then();
