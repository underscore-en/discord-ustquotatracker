import { inject, injectable } from 'inversify';
import { TConfigs } from '../configs';
import { UstHelper } from '../helpers/UstHelper';
import { DiscordService } from '../services/DiscordService';
import { MongoService } from '../services/MongoService';

@injectable()
export class UstController {
    constructor(
        private readonly mongoService: MongoService,
        @inject("DiscordService") private readonly discordService: DiscordService,
    ) {
        // pass
    }

    /**
     * Backend cron logic
     */
    public async update() {
        const subjects: Array<keyof TConfigs["discord"]["ustChIds"]> = [
            "ACCT",
            "BIEN",
            "CHEM", "CIVL", "COMP",
            "ECON", "ELEC", "ENVR",
            "FINA",
            "HART", "HUMA",
            "IEDA", "ISOM",
            "LANG", "LIFS",
            "MARK", "MATH", "MECH", "MGMT",
            "OCES",
            "PHYS",
            "RMBI",
            "SOSC",
            "SUST",
        ];
        for (const subject of subjects) {
            // get data
            try {
                const data = await UstHelper.getData(UstHelper.getSubjectUrl(subject));
                const logEntries: string[] = [];

                // iterate each course
                for (const [courseCode, { title, sectionQuotas }] of [...data.entries()]) {
                    const isUG = +courseCode[5] <= 4;
                    if (!isUG) {
                        continue;
                    }

                    // iterate each sectionQuotas
                    for (const sectionQuota of sectionQuotas) {
                        const document = await this.mongoService.getSectionQuota(UstHelper.semester, sectionQuota.classId);
                        if (document === null) {
                            // the classId is new
                            await this.mongoService.insertSectionQuota(sectionQuota);
                            // tmp comment
                            logEntries.push(`🥖 New Section - ${courseCode} - ${title} [${sectionQuota.section}(${sectionQuota.classId})] (${sectionQuota.quota}).`);
                        } else if (document.quotaChanged(sectionQuota)) {
                            // the classId is old and has changed quota
                            logEntries.push(`🍕 ️Quota Changed: ${courseCode} - ${title} [${sectionQuota.section}(${sectionQuota.classId})] (${document.quota} -> ${sectionQuota.quota}).`);
                            await this.mongoService.updateSectionQuota(sectionQuota.classId, sectionQuota.quota);
                        }
                    }
                }

                // send report to discord
                if (logEntries.length !== 0) {
                    const ch = await this.discordService.getUstTextChannel(subject);
                    // prevents BOOM when first time,
                    let text = "";
                    for (const entry of logEntries) {
                        text += `${entry}\n`;
                        if (text.length >= 1500) {
                            await ch.send(text);
                            text = '';
                        }
                    }
                    if (text.length !== 0) {
                        await ch.send(text);
                    }
                }
            } catch (err) {
                // ignore
            }
        }
    }
}
