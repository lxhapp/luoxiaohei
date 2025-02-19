import { ShardingManager } from 'discord.js';
import { Request, Response, Router } from 'express';
import { createRequire } from 'node:module';

import { Controller } from './index.js';
import { GetGuildsResponse } from '../models/cluster-api/index.js';

const require = createRequire(import.meta.url);
let Config = require('../../config/config.json');

export class GuildsController implements Controller {
    public path = '/guilds';
    public router: Router = Router();
    public authToken: string = Config.api.secret;

    constructor(private shardManager: ShardingManager) {}

    public register(): void {
        this.router.get('/', (req, res) => this.getGuilds(req, res));
    }

    private async getGuilds(req: Request, res: Response): Promise<void> {
        try {
            let guilds: string[] = [
                ...new Set(
                    (
                        await this.shardManager.broadcastEval(client => [
                            ...client.guilds.cache.keys(),
                        ])
                    ).flat()
                ),
            ];

            let resBody: GetGuildsResponse = {
                guilds,
            };
            res.status(200).json(resBody);
        } catch (error) {
            res.status(500).json({ error: 'An error occurred while fetching guilds' });
        }
    }
}
