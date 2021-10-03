declare namespace RestApi {
  declare type Collection = {
    data: CollectionItem[];
    meta: {
      username: string;
      inCache: boolean;
    };
    errors?: unknown[];
  };
  declare type CollectionItem = {
    objectType: string;
    objectId: string;
    subType: "boardgame" | "boardgamexpansion";
    collectionId: string;
    name: string;
    yearPublished: string;
    image: string;
    thumbnail: string;
    status: {
      own: boolean;
      prevOwned: boolean;
      forTrade: boolean;
      want: boolean;
      wantToPlay: boolean;
      wantToBuy: boolean;
      wishlist: boolean;
      wishlistPriority: "1" | "2" | "3" | "4" | "5";
      preordered: boolean;
      lastModified: string;
    };
    stats: {
      minPlayers: number;
      maxPlayers: number;
      minPlayTime: number;
      maxPlayTime: number;
      playingTime: number;
      numOwned: number;
    };
    rating: {
      usersRated: number;
      average: number;
      bayesAverage: number;
      stddev: number;
      median: number;
    };
    ranks: {
      type: string;
      id: number;
      name: string;
      friendlyName: string;
      value: number;
      bayesAverage: number;
    }[];
    plays: number;
  };
}
