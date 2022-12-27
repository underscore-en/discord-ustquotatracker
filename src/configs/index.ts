const channelIds = {
    cronLogs: [
        "REDACTED", // monitor.dev.cronlogs
        "REDACTED", // monitor.prod.cronlogs
    ],
    healthCheck: [
        "REDACTED", // monitor.dev.healthCheck
        "REDACTED", // monitor.dev.healthCheck
    ],
    hahaFunny: [
        "REDACTED", // monitor.dev.hahaFunny
        "REDACTED", // gentsClub.hahaFunny
    ],
} as const;

const ustChIds = {
    ACCT: ["REDACTED", "REDACTED"],
    BIEN: ["REDACTED", "REDACTED"],
    CHEM: ["REDACTED", "REDACTED"],
    CIVL: ["REDACTED", "REDACTED"],
    COMP: ["REDACTED", "REDACTED"],
    ECON: ["REDACTED", "REDACTED"],
    ELEC: ["REDACTED", "REDACTED"],
    ENVR: ["REDACTED", "REDACTED"],
    FINA: ["REDACTED", "REDACTED"],
    HART: ["REDACTED", "REDACTED"],
    HUMA: ["REDACTED", "REDACTED"],
    IEDA: ["REDACTED", "REDACTED"],
    ISOM: ["REDACTED", "REDACTED"],
    LANG: ["REDACTED", "REDACTED"],
    LIFS: ["REDACTED", "REDACTED"],
    MARK: ["REDACTED", "REDACTED"],
    MATH: ["REDACTED", "REDACTED"],
    MECH: ["REDACTED", "REDACTED"],
    MGMT: ["REDACTED", "REDACTED"],
    OCES: ["REDACTED", "REDACTED"],
    PHYS: ["REDACTED", "REDACTED"],
    RMBI: ["REDACTED", "REDACTED"],
    SOSC: ["REDACTED", "REDACTED"],
    SUST: ["REDACTED", "REDACTED"],
} as const;

const guildIds = {
    monitor: "blah",
    gentsClub: "blah",
    quotaTracker: "940857138115387423",
} as const;

export type TChannelKey = keyof typeof channelIds;

export type TGuildKey = keyof typeof guildIds;

export const configs = {
    discord: {
        channelIds,
        guildIds,
        ustChIds,
    },
    mongo: {
        uri: process.env.MONGO_URI!,
    },
    bot: {
        token: process.env.DISCORD_BOT_TOKEN!,
    },
};

export type TConfigs = typeof configs;
