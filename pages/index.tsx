import {
  Box,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  Input,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import type { NextPage } from "next";
import Image from "next/image";
import { decode } from "he";

import useSWR from "swr";
import { useMemo, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function Item({
  name,
  image,
  thumbnail,
  yearPublished,
  objectId,
  status,
  stats,
  ranks,
  rating,
}: RestApi.CollectionItem): React.ReactElement {
  return (
    <>
      <Grid container>
        <Grid
          item
          sm={4}
          p={1}
          sx={{
            backgroundColor: "grey.300",
            display: "flex",
            flex: 1,
          }}
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
        <Grid item sm={8}>
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
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Box>
              <Box marginBottom={1}>
                {stats.minPlayers}—{stats.maxPlayers} players
              </Box>
              <Box marginBottom={1}>
                {rating.average && (
                  <>
                    <Box>
                      • Rating: {rating.average.toFixed(2)} (
                      {rating.bayesAverage.toFixed(2)})
                    </Box>
                    <Box>• {rating.usersRated.toLocaleString()} users</Box>
                  </>
                )}
              </Box>
              <Box marginBottom={1}>
                {ranks
                  .filter(function (rank) {
                    return Boolean(rank.value);
                  })
                  .map(function (rank, idx) {
                    return (
                      <Box key={idx}>
                        • {rank.friendlyName} | {rank.value.toLocaleString()}
                      </Box>
                    );
                  })}
              </Box>
            </Box>
            {/* <FormGroup>
              <FormControlLabel
                control={<Switch disabled checked={status.own} />}
                label={<>Own</>}
              />
              <FormControlLabel
                control={<Switch disabled checked={status.wantToPlay} />}
                label={<>Want To Play</>}
              />
              <FormControlLabel
                control={
                  <Switch
                    disabled
                    checked={status.wantToBuy || status.wishlist}
                  />
                }
                label={<>Want To Buy</>}
              />
            </FormGroup> */}
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
  const [filters, setFilters] = useState<{
    owned: boolean;
    wanted: boolean;
    players: number | null;
    name: string | null;
  }>({
    owned: true,
    wanted: false,
    players: null,
    name: null,
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
          return (owned || wanted) && meetsMinPlayers && meetsName;
        })
      : [];
  }, [filters, nameFilter, data?.data]);
  return (
    <Box>
      <Box m={2}>
        <FormGroup sx={{ flexDirection: "row" }}>
          <FormControlLabel
            control={
              <Switch
                checked={filters.owned}
                onChange={(ev) =>
                  setFilters({ ...filters, owned: ev.target.checked })
                }
              />
            }
            label={<>Own</>}
          />
          <FormControlLabel
            control={
              <Switch
                checked={filters.wanted}
                onChange={(ev) =>
                  setFilters({ ...filters, wanted: ev.target.checked })
                }
              />
            }
            label={<>Wanted</>}
          />
          <Box marginX={1}>
            <TextField
              type="number"
              label="Player Count"
              onChange={(ev) =>
                setFilters({
                  ...filters,
                  players: Number(ev.target.value),
                })
              }
            />
          </Box>
          <Box marginX={1}>
            <TextField
              type="text"
              label="Game Name"
              onChange={(ev) =>
                setFilters({
                  ...filters,
                  name: ev.target.value,
                })
              }
            />
          </Box>
        </FormGroup>
      </Box>
      <Grid container rowSpacing={1} columnSpacing={1}>
        {filteredData.map((item, idx) => (
          <Grid
            item
            key={idx}
            xs={12}
            sm={6}
            md={4}
            lg={3}
            xl={2}
            sx={{ display: "flex" }}
          >
            <Item {...item} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
