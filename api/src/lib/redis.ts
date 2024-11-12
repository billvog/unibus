import RedisClient from "ioredis";

import { env } from "@api/env";

export const client = new RedisClient(env.REDIS_URL);
