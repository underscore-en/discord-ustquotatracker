import { server, startServer } from '../../src/share';
import { UstController } from '../../src/controllers/UstController';

let controller: UstController;

describe('UstController', () => {
    before(async () => {
        await startServer();
        controller = server.container.get<UstController>("UstController");
    });

    it('update', async () => {
        await controller.update();
    }).timeout(10 * 60 * 1000);
});
