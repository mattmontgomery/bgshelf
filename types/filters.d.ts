declare namespace BGShelf {
  declare type Filters = {
    minRating: number | null;
    name: string | null;
    notPlayed: boolean;
    owned: boolean;
    players: number | null;
    wanted: boolean;
    yearPublished: number | null;
  };
  declare type SortMethod = (
    field: keyof RestApi.CollectionItem,
    direction: "asc" | "desc"
  ) => void;
  declare type SortKey = keyof RestApi.CollectionItem;
}
