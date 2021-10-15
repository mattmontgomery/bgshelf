import { NextApiRequest, NextApiResponse } from "next";

import Redis from "ioredis";
import Client from "../../../lib/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BGShelf.Collection>
): Promise<void> {
  const redisClient = new Redis(process.env.REDIS_URL);
  const username = req.query.username.toString();
  const cacheKey = `collection|stats|${username}|20211013`;
  const client = new Client(username);
  const cachedData = await redisClient.get(cacheKey);
  let returnData: BGShelf.CollectionItem[];
  if (!cachedData) {
    const data = await client.fetchCollection();
    returnData = data;
    await redisClient.set(cacheKey, JSON.stringify(data), "EX", 60 * 60 * 24); // 24 hour expiration
  } else {
    returnData = cachedData ? JSON.parse(cachedData) : null;
  }
  redisClient.disconnect();

  if (!returnData) {
    res.status(404);
    res.json({
      data: [],
      meta: { username, inCache: false },
      errors: [404],
    });
    return;
  }
  res.json({
    data: returnData as BGShelf.CollectionItem[],
    meta: { username, inCache: !!cachedData },
  });
}
