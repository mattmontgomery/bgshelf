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
  declare type SortMethod = (field: SortKey, direction: SortDirection) => void;
  declare type SortProps = { field: SortKey; direction: SortDirection };
  declare type SortKey = keyof BGShelf.CollectionItem;
  declare type SortDirection = "asc" | "desc";
}
