import { Box, Divider, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import Image from "next/image";
import { decode } from "he";

import Filters from "../components/Filters";

import useSWR from "swr";
import { useMemo, useState } from "react";

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
}: RestApi.CollectionItem): React.ReactElement {
  return (
    <>
      <Grid container>
        <Grid
          item
          sm={4}
          xl={3}
          p={1}
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
            </Box>
          )}
        </Grid>
        <Grid item sm={8} xl={9}>
          <Box paddingX={1}>
            <Box marginBottom={1}>
              <Typography
                variant="h6"
                component="a"
                href={`https://boardgamegeek.com/boardgame/${objectId}`}
                target="_blank"
              >
                <>
                  {decode(String(name))} ({yearPublished})
                </>
              </Typography>
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
  const { data } = useSWR<RestApi.Collection>(
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
  });
  const nameFilter = useMemo(() => {
    return filters.name ? new RegExp(filters.name, "i") : "";
  }, [filters.name]);
  const filteredData = useMemo<RestApi.CollectionItem[]>(() => {
    return data?.data
      ? data?.data.filter(function (item) {
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
          return (
            meetsOwnedOrWanted &&
            meetsMinPlayers &&
            meetsName &&
            meetsNotPlayed &&
            meetsMinRating
          );
        })
      : [];
  }, [filters, nameFilter, data?.data]);
  return (
    <Box>
      <Box m={2}>
        <Filters filters={filters} onChangeFilters={setFilters} />
      </Box>
      <Divider />
      <Box marginY={2} sx={{ textAlign: "right" }}>
        {filteredData.length} games
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

export default Home;
