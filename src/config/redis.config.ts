import { createClient, RedisClientType } from "redis";

const redisOptions =
  process.env.NODE_ENV === "production"
    ? { url: process.env.REDIS_URL }
    : {
        socket: {
          port: parseInt(process.env.REDIS_PORT!),
          host: process.env.REDIS_HOST!,
        },
      };

export let client: RedisClientType;

export const invokeRedisClient = async () => {
  client = createClient(redisOptions);
  await client.connect();
};
