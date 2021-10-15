import { NextApiRequest, NextApiResponse } from "next";

import Redis from "ioredis";
import Client from "../../../lib/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BGShelf.ThingResponse>
): Promise<void> {
  const redisClient = new Redis(process.env.REDIS_URL);
  const thingIds: number[] = req.query.id
    .toString()
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n));
  const client = new Client();
  const cacheKey = (id: number) => `things|${id}|20211013`;
  const thingsNotInCache: number[] = [];
  const thingsInCache = (
    await Promise.all(
      thingIds.map(async (id) => {
        const inCache = await redisClient.get(cacheKey(id));
        if (inCache) {
          return JSON.parse(inCache);
        } else {
          thingsNotInCache.push(id);
        }
      })
    )
  ).filter(Boolean);
  const things = thingsNotInCache.length
    ? await client.fetchThings(thingsNotInCache)
    : [];
  await Promise.all(
    things.map(async (thing) => {
      await redisClient.set(
        cacheKey(thing.id),
        JSON.stringify(thing),
        "EX",
        60 * 60 * 24 * 365
      ); // 1 year expiration for things
    })
  );
  redisClient.disconnect();
  res.json({
    data: [...thingsInCache, ...things],
    meta: {
      ids: thingIds.map(Number),
    },
  });
}
