import fetch from "axios";
import x2js from "x2js";

type StringValue = {
  _value: string;
};

type Rank = {
  _type: string;
  _id: number;
  _name: string;
  _friendlyname: string;
  _value: string;
  _bayesaverage: string;
};

type StringBoolean = "0" | "1";

function parseRank(rank: Rank) {
  return {
    type: rank._type,
    id: rank._id,
    name: rank._name,
    friendlyName: rank._friendlyname,
    value: Number(rank._value),
    bayesAverage: Number(rank._bayesaverage),
  };
}

export default class Client {
  private username: string;
  private xml: string = "";
  constructor(username: string) {
    this.username = username;
  }
  public async fetchCollection(): Promise<RestApi.CollectionItem[]> {
    const resp = await fetch(Client.getCollectionUrl(this.username));
    const body = resp.data;
    this.xml = body;
    const x2jsClient = new x2js();
    const jsonBody = x2jsClient.xml2js<{
      items: {
        item: {
          name: { __text: string };
          yearpublished: string;
          image: string;
          thumbnail: string;
          numplays: string;
          _collid: string;
          _objecttype: string;
          _objectid: string;
          _subtype: string;
          stats: {
            _minplayers: string;
            _maxplayers: string;
            _minplaytime: string;
            _maxplaytime: string;
            _playingtime: string;
            _numowned: string;
            rating: {
              usersrated: StringValue;
              average: StringValue;
              bayesaverage: StringValue;
              stddev: StringValue;
              median: StringValue;
              ranks: {
                rank: Rank[] | Rank;
              };
            };
          };
          status: {
            _own: StringBoolean;
            _prevowned: StringBoolean;
            _fortrade: StringBoolean;
            _want: StringBoolean;
            _wanttoplay: StringBoolean;
            _wanttobuy: StringBoolean;
            _wishlist: StringBoolean;
            _wishlistpriority: "string";
            _preordered: StringBoolean;
            _lastmodified: string;
          };
        }[];
      };
    }>(body);
    console.log(JSON.stringify(jsonBody, null, 2));
    return jsonBody?.items?.item.map((item) => ({
      name: item.name.__text,
      yearPublished: item.yearpublished,
      image: item.image,
      thumbnail: item.thumbnail,
      plays: Number(item.numplays),
      collectionId: item._collid,
      objectId: item._objectid,
      objectType: item._objecttype,
      subType: item._subtype as RestApi.CollectionItem["subType"],
      stats: {
        maxPlayers: Number(item.stats._maxplayers),
        minPlayers: Number(item.stats._minplayers),
        maxPlayTime: Number(item.stats._maxplaytime),
        minPlayTime: Number(item.stats._minplaytime),
        numOwned: Number(item.stats._numowned),
        playingTime: Number(item.stats._playingtime),
      },
      ranks: Array.isArray(item.stats?.rating?.ranks?.rank)
        ? item.stats.rating.ranks.rank.map(parseRank)
        : item.stats?.rating?.ranks?.rank
        ? [parseRank(item.stats?.rating?.ranks?.rank)]
        : [],
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
          ._wishlistpriority as RestApi.CollectionItem["status"]["wishlistPriority"],
      },
    }));
  }
  public static getCollectionUrl(username: string) {
    return `https://www.boardgamegeek.com/xmlapi2/collection?stats=1&version=1&excludesubtype=boardgameexpansion&username=${username}`;
  }
}
