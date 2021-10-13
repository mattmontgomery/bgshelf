declare namespace BGShelf {
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
    status: CollectionItemStatus;
    stats: CollectionItemStats;
    rating: CollectionItemRating;
    ranks: CollectionItemRank[];
    plays: number;
  } & Partial<CollectionItemRanksFlat>;
  declare type CollectionItemStats = {
    minPlayers: number;
    maxPlayers: number;
    minPlayTime: number;
    maxPlayTime: number;
    playingTime: number;
    numOwned: number;
  };
  declare type CollectionItemRating = {
    usersRated: number;
    average: number;
    bayesAverage: number;
    stddev: number;
    median: number;
  };
  declare type CollectionItemRank = {
    type: string;
    id: number;
    name: string;
    friendlyName: string;
    value: number;
    bayesAverage: number;
  };
  declare type CollectionItemStatus = {
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
  declare type CollectionItemRanksFlat = Record<RankCategories, number>;
  declare type RankCategories =
    | "rank_boardgame"
    | "rank_wargames"
    | "rank_strategygames"
    | "rank_familygames"
    | "rank_thematic";
}
