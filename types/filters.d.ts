declare namespace BGShelf {
  declare type Filters = {
    minRating: number | null;
    name: string | null;
    notPlayed: boolean;
    owned: boolean;
    players: number | null;
    wanted: boolean;
  };
}
