import {
  Box,
  Button,
  ButtonProps,
  Divider,
  Grid,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Image from "next/image";
import { decode } from "he";

import Filters from "../components/Filters";

import useSWR from "swr";
import { useMemo, useState } from "react";

import orderBy from "lodash.orderby";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Item({
  name,
  objectId,
  plays,
  ranks,
  rating,
  stats,
  status,
  thumbnail,
  yearPublished,
  rank_boardgame,
}: BGShelf.CollectionItem): React.ReactElement {
  return (
    <>
      <Grid
        container
        sx={{
          border: "1px solid",
          borderColor: "grey.300",
        }}
      >
        <Grid
          item
          sm={4}
          xl={3}
          sx={{
            backgroundColor: "grey.200",
            display: "flex",
            flex: 1,
          }}
          component="a"
          href={`https://boardgamegeek.com/boardgame/${objectId}`}
          target="_blank"
        >
          {thumbnail && (
            <Box
              sx={{
                width: "100%",
                minWidth: "50px",
                height: "100%",
                flex: 1,
                position: "relative",
              }}
            >
              <Image
                src={thumbnail}
                layout="fill"
                alt={name}
                objectFit="contain"
              />
              {rank_boardgame && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    right: 0,
                    padding: 1,
                    backgroundColor: "RGBA(0,0,0,0.6)",
                    color: "white",
                  }}
                >
                  {rank_boardgame}
                </Box>
              )}
            </Box>
          )}
        </Grid>
        <Grid item sm={8} xl={9}>
          <Box padding={2}>
            <Box marginBottom={1}>
              <Grid container>
                <Grid item md={8}>
                  <Typography
                    variant="h6"
                    component="a"
                    href={`https://boardgamegeek.com/boardgame/${objectId}`}
                    target="_blank"
                  >
                    <>{decode(String(name))}</>
                  </Typography>
                </Grid>
                <Grid item md={4} sx={{ textAlign: "right" }}>
                  {yearPublished}
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <Box marginY={1} sx={{ fontSize: 14 }}>
              <Box marginBottom={1}>
                {[
                  status.own ? "Owned" : null,
                  status.wantToBuy ? "Wanted" : null,
                  status.wantToPlay ? "Want to Play" : null,
                ]
                  .filter(Boolean)
                  .join(", ")}{" "}
              </Box>
              <Box>
                <Box>
                  • <strong>Plays</strong>: {plays} play{plays === 1 ? "" : "s"}
                </Box>
                <Box>
                  • <strong>Player Count</strong>: {stats.minPlayers}—
                  {stats.maxPlayers}
                </Box>
                {rating.average && (
                  <Box>
                    • <strong>Rating</strong>: {rating.average.toFixed(2)} (
                    {rating.bayesAverage.toFixed(2)})
                  </Box>
                )}
                {ranks
                  .filter(function (rank) {
                    return Boolean(rank.value);
                  })
                  .map(function (rank, idx) {
                    return (
                      <Box key={idx}>
                        • <strong>{rank.friendlyName}:</strong>{" "}
                        {rank.value.toLocaleString()}
                      </Box>
                    );
                  })}
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

const Home: NextPage = () => {
  const { data, isValidating } = useSWR<BGShelf.Collection>(
    "/api/collection/moonty",
    fetcher,
    {
      revalidateOnFocus: false,
    }
  );
  const [filters, setFilters] = useState<BGShelf.Filters>({
    minRating: 0,
    name: null,
    owned: true,
    notPlayed: false,
    players: null,
    wanted: false,
    yearPublished: null,
  });
  const [sort, setSort] = useState<BGShelf.SortProps[]>([
    { field: "name", direction: "asc" },
  ]);
  const nameFilter = useMemo(() => {
    return filters.name ? new RegExp(filters.name, "i") : "";
  }, [filters.name]);
  const filteredData = useMemo<BGShelf.CollectionItem[]>(() => {
    const items = data?.data
      ? data?.data.filter(function (item: BGShelf.CollectionItem) {
          const owned = item.status.own && filters.owned;
          const wanted =
            (item.status.wantToBuy || item.status.wishlist) && filters.wanted;
          const meetsMinPlayers = filters.players
            ? item.stats.minPlayers <= filters.players &&
              item.stats.maxPlayers >= filters.players
            : true;
          const meetsName: boolean = filters.name
            ? Boolean(item.name.match(nameFilter))
            : true;
          const meetsNotPlayed = filters.notPlayed ? item.plays === 0 : true;
          const meetsMinRating = filters.minRating
            ? item.rating.average > filters.minRating
            : true;
          const meetsOwnedOrWanted = owned || wanted;
          const meetsYear = filters.yearPublished
            ? Number(item.yearPublished) === filters.yearPublished
            : true;
          return (
            meetsOwnedOrWanted &&
            meetsMinPlayers &&
            meetsName &&
            meetsNotPlayed &&
            meetsMinRating &&
            meetsYear
          );
        })
      : [];
    return orderBy(
      items,
      sort.map(({ field, direction }) => field),
      sort.map(({ field, direction }) => direction)
    );
  }, [filters, nameFilter, sort, data?.data]);
  const changeSortOrder = useMemo(() => {
    const sortOperation: BGShelf.SortMethod = (field, direction) => {
      setSort([
        {
          field,
          direction,
        },
        ...sort.filter((sortOp) => sortOp.field !== field),
      ]);
    };
    return sortOperation;
  }, [sort]);
  const sortMap = useMemo(() => {
    return sort.reduce(
      (prev: Partial<Record<BGShelf.SortKey, "asc" | "desc">>, curr) => {
        prev[curr.field] = curr.direction;
        return prev;
      },
      {}
    );
  }, [sort]);
  return (
    <Box>
      <Box m={2}>
        <Filters filters={filters} onChangeFilters={setFilters} />
      </Box>
      <Divider />
      <Box marginY={2}>
        <Grid container>
          <Grid item md={10} sx={{ alignSelf: "center" }}>
            <Button variant="text" disabled>
              Sort
            </Button>
            <SortButton
              onChangeSort={changeSortOrder}
              direction={sortMap.name === "asc" ? "desc" : "asc"}
              field="name"
            >
              Name
            </SortButton>
            <SortButton
              onChangeSort={changeSortOrder}
              direction={
                sortMap.yearPublished === "asc" || !sortMap.yearPublished
                  ? "desc"
                  : "asc"
              }
              field="yearPublished"
            >
              Year
            </SortButton>
            <SortButton
              onChangeSort={changeSortOrder}
              direction={
                sortMap.rank_boardgame === "desc" || !sortMap.rank_boardgame
                  ? "asc"
                  : "desc"
              }
              field="rank_boardgame"
            >
              BGG Ranking
            </SortButton>
          </Grid>
          <Grid item md={2} sx={{ textAlign: "right", alignSelf: "center" }}>
            {isValidating ? "Loading" : filteredData.length} games
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <Box marginY={2}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          {filteredData.map((item, idx) => (
            <Grid item key={idx} xs={12} sm={6} xl={4} sx={{ display: "flex" }}>
              <Item {...item} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

function SortButton({
  children,
  direction,
  field,
  onChangeSort,
  ...rest
}: {
  children: React.ReactNode;
  onChangeSort: BGShelf.SortMethod;
} & ButtonProps &
  BGShelf.SortProps): React.ReactElement {
  return (
    <Box marginX={1} sx={{ display: "inline-flex" }}>
      <Button onClick={() => onChangeSort(field, direction)} {...rest}>
        {children} ({direction === "asc" ? "A-Z" : "Z-A"})
      </Button>
    </Box>
  );
}

export default Home;
