declare namespace BGShelf {
  type StringBoolean = "0" | "1";

  type StringValue = {
    _value: string;
  };
  declare type BGGResponse<T> = {
    items: {
      item: T[];
    };
  };
  declare type BGGRank = {
    _type: string;
    _id: number;
    _name: string;
    _friendlyname: string;
    _value: string;
    _bayesaverage: string;
  };

  declare type BGGItem = {
    name: { __text: string };
    yearpublished: string;
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
          rank: BGGRank[] | BGGRank;
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
  } & BGGImages;
  declare type BGGImages = {
    image: string;
    thumbnail: string;
  };
  declare type BGGThing = {
    _type: "boardgame";
    _id: string;
    name: ({
      _type: "primary" | "alternate";
      _sortindex: "string";
    } & StringValue)[];
    description: string;
    yearpublished: StringValue;
    minplayers: StringValue;
    maxplayers: StringValue;
    poll: {
      results: {
        result: ({
          _numvotes: string;
        } & StringValue)[];
        [pollName: "_numplayers" | string]: string;
      };
      _name: string;
      _title: string;
      _totalvotes: string;
    }[];
    playingtime: StringValue;
    minplaytime: StringValue;
    maxplaytime: StringValue;
    minage: StringValue;
    link: ({
      _type: string;
      _id: string;
    } & StringValue)[];
  } & BGGImages;
  declare type BGGLinkType = "boardgamecategory" | "boardgamemechanic";
}
