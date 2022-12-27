import { MongoResource } from '../resources/MongoResource';
import { Service } from '../ioc';
import { SectionQuota } from '../entities/Ust/SectionQuota';

@Service
export class MongoService {
    constructor(public mongoResource: MongoResource) {
        //
    }

    /**
     * SectionQuota
     */
    public async insertSectionQuota(sectionQuota: SectionQuota) {
        const model = this.mongoResource.sectionQuotaModel;
        return model.create(sectionQuota);
    }

    public async updateSectionQuota(classId: number, quota: number) {
        const model = this.mongoResource.sectionQuotaModel;
        return model.findOneAndUpdate(
            { classId },
            { $set: { quota } },
        ).exec();
    }

    public async getSectionQuota(semester: number, classId: number) {
        const model = this.mongoResource.sectionQuotaModel;
        return model.findOne(
            { classId, semester },
        ).exec();
    }
}
