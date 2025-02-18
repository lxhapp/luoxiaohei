import { ActivityType, ShardingManager } from 'discord.js';
import { createRequire } from 'node:module';

import { Job } from './index.js';
import { CustomClient } from '../extensions/index.js';
import { AppSite } from '../models/config-models.js';
import { HttpService, Logger } from '../services/index.js';
import { ShardUtils } from '../utils/index.js';

const require = createRequire(import.meta.url);
let AppSites: AppSite[] = require('../../config/app-sites.json');
let Config = require('../../config/config.json');
let Logs = require('../../lang/logs.json');

export class UpdateServerCountJob extends Job {
    public name = 'Update Server Count';
    public schedule: string = Config.jobs.updateServerCount.schedule;
    public log: boolean = Config.jobs.updateServerCount.log;
    public runOnce: boolean = Config.jobs.updateServerCount.runOnce;
    public initialDelaySecs: number = Config.jobs.updateServerCount.initialDelaySecs;

    private appSites: AppSite[];

    constructor(
        private shardManager: ShardingManager,
        private httpService: HttpService
    ) {
        super();
        this.appSites = AppSites.filter(appSite => appSite.enabled);
    }

    public async run(): Promise<void> {
        let serverCount = await ShardUtils.serverCount(this.shardManager);
        let shardCount = ShardUtils.shardIds(this.shardManager).length.toString();

        let type = ActivityType.Streaming;
        let name = `to ${serverCount.toLocaleString()} servers`;
        let url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

        await this.shardManager.broadcastEval(
            (client, context) => {
                let customClient = client as CustomClient;
                return customClient.setPresence(context.type, context.name, context.url);
            },
            { context: { type, name, url } }
        );

        Logger.info(
            Logs.info.updatedServerCount
                .replaceAll('{SERVER_COUNT}', serverCount.toLocaleString())
                .replaceAll('{SHARD_COUNT}', shardCount)
        );

        for (let appSite of this.appSites) {
            try {
                let body = JSON.parse(
                    appSite.body
                        .replaceAll('{{SERVER_COUNT}}', serverCount.toString())
                        .replaceAll('{{SHARD_COUNT}}', shardCount)
                );
                let res = await this.httpService.post(appSite.url, appSite.authorization, body);

                if (!res.ok) {
                    throw res;
                }
            } catch (error) {
                Logger.error(
                    Logs.error.updatedServerCountSite.replaceAll('{APP_SITE}', appSite.name),
                    error
                );
                continue;
            }

            Logger.info(Logs.info.updatedServerCountSite.replaceAll('{APP_SITE}', appSite.name));
        }
    }
}
