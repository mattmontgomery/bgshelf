import {
  Box,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField,
} from "@mui/material";

export default function Filters({
  filters,
  onChangeFilters,
}: {
  filters: BGShelf.Filters;
  onChangeFilters: (filters: BGShelf.Filters) => void;
}): React.ReactElement {
  return (
    <>
      <FormGroup sx={{ flexDirection: "row" }}>
        <FormControlLabel
          control={
            <Switch
              checked={filters.owned}
              onChange={(ev) =>
                onChangeFilters({ ...filters, owned: ev.target.checked })
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
                onChangeFilters({ ...filters, wanted: ev.target.checked })
              }
            />
          }
          label={<>Wanted</>}
        />
        <FormControlLabel
          control={
            <Switch
              checked={filters.notPlayed}
              onChange={(ev) =>
                onChangeFilters({ ...filters, notPlayed: ev.target.checked })
              }
            />
          }
          label={<>Unplayed</>}
        />
        <Box marginX={1}>
          <TextField
            type="number"
            label="Player Count"
            onChange={(ev) =>
              onChangeFilters({
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
              onChangeFilters({
                ...filters,
                name: ev.target.value,
              })
            }
          />
        </Box>
        <Box marginX={1}>
          <TextField
            type="number"
            label="Min. Rating"
            onChange={(ev) =>
              onChangeFilters({
                ...filters,
                minRating: Number(ev.target.value),
              })
            }
          />
        </Box>
        <Box marginX={1}>
          <TextField
            type="number"
            label="Year"
            onChange={(ev) =>
              onChangeFilters({
                ...filters,
                yearPublished: Number(ev.target.value),
              })
            }
          />
        </Box>
      </FormGroup>
    </>
  );
}
