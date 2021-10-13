import fetch from "axios";
import x2js from "x2js";

function getRanks(item: BGShelf.BGGItem): BGShelf.CollectionItemRank[] {
  return asArray(item.stats?.rating?.ranks?.rank).map(parseRank);
}

function parseRank(rank: BGShelf.BGGRank): BGShelf.CollectionItemRank {
  return {
    type: rank._type,
    id: rank._id,
    name: rank._name,
    friendlyName: rank._friendlyname,
    value: Number(rank._value),
    bayesAverage: Number(rank._bayesaverage),
  };
}

function asArray<T = unknown>(from: T | T[]): T[] {
  if (!from) {
    return [];
  } else if (!Array.isArray(from)) {
    return [from];
  } else {
    return from;
  }
}

export default class Client {
  private username?: string;
  constructor(username?: string) {
    if (username) {
      this.username = username;
    }
  }
  public async fetchCollection(): Promise<BGShelf.CollectionItem[]> {
    if (!this.username) {
      throw "A username is required to fetch a collection";
    }
    const resp = await fetch(Client.getCollectionUrl(this.username));
    const body = resp.data;
    const x2jsClient = new x2js();
    const jsonBody =
      x2jsClient.xml2js<BGShelf.BGGResponse<BGShelf.BGGItem>>(body);
    return jsonBody?.items?.item.map(
      (item): BGShelf.CollectionItem => ({
        name: item.name.__text,
        yearPublished: item.yearpublished,
        image: item.image,
        thumbnail: item.thumbnail,
        plays: Number(item.numplays),
        collectionId: item._collid,
        objectId: item._objectid,
        objectType: item._objecttype,
        subType: item._subtype as BGShelf.CollectionItem["subType"],
        stats: {
          maxPlayers: Number(item.stats._maxplayers),
          minPlayers: Number(item.stats._minplayers),
          maxPlayTime: Number(item.stats._maxplaytime),
          minPlayTime: Number(item.stats._minplaytime),
          numOwned: Number(item.stats._numowned),
          playingTime: Number(item.stats._playingtime),
        },
        ranks: getRanks(item),
        rating: {
          usersRated: Number(item.stats.rating.usersrated._value),
          average: Number(item.stats.rating.average._value),
          bayesAverage: Number(item.stats.rating.bayesaverage._value),
          median: Number(item.stats.rating.median._value),
          stddev: Number(item.stats.rating.stddev._value),
        },
        status: {
          forTrade: item.status._fortrade === "1",
          lastModified: item.status._lastmodified,
          own: item.status._own === "1",
          preordered: item.status._preordered === "1",
          prevOwned: item.status._prevowned === "1",
          want: item.status._want === "1",
          wantToBuy: item.status._wanttobuy === "1",
          wantToPlay: item.status._wanttoplay === "1",
          wishlist: item.status._wishlist === "1",
          wishlistPriority: item.status
            ._wishlistpriority as BGShelf.CollectionItem["status"]["wishlistPriority"],
        },
        ...getRanks(item).reduce(
          (acc: Record<string, number>, curr: BGShelf.CollectionItemRank) => {
            acc[`rank_${curr.name}`] = curr.value;
            return acc;
          },
          {}
        ),
      })
    );
  }
  public async fetchThings(ids: number[]): Promise<BGShelf.Thing[]> {
    const resp = await fetch(Client.getThingUrl(ids));
    const body = resp.data;
    const x2jsClient = new x2js();
    const jsonBody =
      x2jsClient.xml2js<BGShelf.BGGResponse<BGShelf.BGGThing>>(body);
    return jsonBody?.items?.item.map(
      (thing): BGShelf.Thing => ({
        id: Number(thing._id),
        description: thing.description,
        image: thing.image,
        links: thing.link?.map((link) => ({
          id: Number(link._id),
          value: link._value,
          type: link._type as BGShelf.BGGLinkType,
        })),
        maxPlayTime: Number(thing.maxplaytime),
        minPlayTime: Number(thing.minplaytime),
        maxPlayers: Number(thing.maxplayers),
        minPlayers: Number(thing.minplayers),
        minAge: Number(thing.minage),
        name: asArray(thing.name).map((name) => ({
          type: name._type,
          value: name._value,
        })),
        playTime: Number(thing.playingtime),
        polls: thing.poll.map((poll) => ({
          name: poll._name,
          title: poll._title,
          totalVotes: Number(poll._totalvotes),
          results: {
            result: poll.results?.result?.map((result) => ({
              value: result._value,
              votes: Number(result._numvotes),
            })),
          },
        })),
        thumbnail: thing.thumbnail,
        type: thing._type,
        yearPublished: Number(thing.yearpublished),
      })
    );
  }
  public static getCollectionUrl(username: string) {
    return `https://www.boardgamegeek.com/xmlapi2/collection?stats=1&version=1&excludesubtype=boardgameexpansion&username=${username}`;
  }
  public static getThingUrl(ids: number[]) {
    return `https://www.boardgamegeek.com/xmlapi2/thing?id=${ids.join(",")}`;
  }
}
