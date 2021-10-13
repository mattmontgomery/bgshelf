declare namespace BGShelf {
  declare type Thing = {
    type: "boardgame";
    id: number;
    name: { type: "primary" | "alternate"; value: string }[];
    description: string;
    image: string;
    thumbnail: string;
    yearPublished: number;
    minPlayers: number;
    maxPlayers: number;
    polls: {
      results: {
        result: {
          value: string;
          votes: number;
        }[];
      };
      name: string;
      title: string;
      totalVotes: number;
    }[];
    playTime: number;
    minPlayTime: number;
    maxPlayTime: number;
    minAge: number;
    links: {
      type: BGShelf.BGGLinkType;
      id: number;
      value: string;
    }[];
  };
  declare type ThingResponse = {
    data: Thing[];
    meta: {
      ids: number[];
    };
  };
}
