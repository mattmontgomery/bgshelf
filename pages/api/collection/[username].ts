import bggClient, { BggCollectionResponse } from "bgg-xml-api-client";
import { NextApiRequest, NextApiResponse } from "next";

import Redis from "ioredis";
import Client from "../../../lib/client";

const redisClient = new Redis(process.env.REDIS_URL);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RestApi.Collection>
): Promise<void> {
  const username = req.query.username.toString();
  const cacheKey = `collection|stats|${username}`;
  const client = new Client(username);
  const cachedData = await redisClient.get(cacheKey);
  let returnData: RestApi.CollectionItem[];
  if (!cachedData) {
    const data = await client.fetchCollection();
    returnData = data;
    await redisClient.set(cacheKey, JSON.stringify(data), "EX", 60 * 60 * 24); // 24 hour expiration
  } else {
    returnData = cachedData ? JSON.parse(cachedData) : null;
  }

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
    data: returnData as RestApi.CollectionItem[],
    meta: { username, inCache: !!cachedData },
  });
}
