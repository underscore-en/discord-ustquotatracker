import dayjs from 'dayjs';
import { server, startServer } from '../../src/share';
import { DiscordController } from '../../src/controllers/DiscordController';
import { MongoService } from '../../src/services/MongoService';
import { MongoResource } from '../../src/resources/MongoResource';

let controller: DiscordController;
let mongoService: MongoService;
let mongoResource: MongoResource;

describe('discordController', () => {
    before(async () => {
        await startServer();
        controller = server.container.get<DiscordController>("DiscordController");
        mongoService = server.container.get<MongoService>(MongoService);
        mongoResource = server.container.get<MongoResource>(MongoResource);
    });

    it('runMethod', async () => {
        await controller.run(async () => { throw new Error("test err message"); }, "test method that fails");
    });

    it('healthCheck', async () => {
        await controller.healthCheck(0);
    });

    it('remindSleep', async () => {
        await controller.remindSleep();
    });
});
