"use client";
import {
  Slide,
  Paper,
  Checkbox,
  FormControlLabel,
  IconButton,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import theme from "@/theme/theme";
import { useSearchContext } from "@/app/katalog/context";
import SortedGroupedSelect from "../../components/SortedSelect";
import Close from "@mui/icons-material/Close";
import FilterLister from "./FilterLister";
import { PrimaryButton, SecondaryButton } from "@/theme/buttons/Buttons";
import SearchIcon from "@mui/icons-material/Search";
type SearcherProps = {};
export const FiltringWindow: React.FC<SearcherProps> = () => {
  const {
    isOpenSearcher,
    setOpenSearcher,
    activeFilters,
    handleActiveFilterChange,
    filterValues,
  } = useSearchContext();

  return (
    <Slide
      direction="up"
      className="fixed bottom-0 left-0 right-0 md:left-16 md:right-16 z-50 p-4 h-full  bg-white"
      in={isOpenSearcher}
      mountOnEnter
      unmountOnExit
    >
      <Paper className={"relative pl-4"} elevation={3}>
        <IconButton
          className="absolute top-0 overflow-y-auto right-0 m-2"
          onClick={() => {
            setOpenSearcher(!isOpenSearcher);
          }}
        >
          <Close />
        </IconButton>
        <FilterLister />

        <Stack spacing={2} className="m-2 mt-8 center-flex flex-col mx-4">
          <SortedGroupedSelect
            options={filterValues["category"]}
            label={"kategorie"}
            handleChange={(newVal) =>
              handleActiveFilterChange("category", newVal)
            }
          />

          {/* <InputLabel shrink>
            Žánry: {activeFilters.genres?.join(",") || "None"}
          </InputLabel> */}
          {/* <SortedGroupedSelect
           options={filterValues['genres']}

            label={"žánry"}
            handleChange={(newVal) =>
              handleActiveFilterChange("genres", newVal)
            }
          /> */}

          {/* <InputLabel shrink>
            Autor: {activeFilters.author || "None"}
          </InputLabel> */}
          <SortedGroupedSelect
            options={filterValues["author"]}
            label={"autor"}
            handleChange={(newVal) =>
              handleActiveFilterChange("author", newVal)
            }
          />
        </Stack>

        <FormControlLabel
          className="ml-4"
          control={
            <Checkbox
              checked={Boolean(activeFilters.available)}
              onChange={(e) =>
                handleActiveFilterChange("available", e.target.checked)
              }
            />
          }
          label="Dostupnost"
          sx={{
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.secondary.main,
            },
          }}
        />
        <br />
        <FormControlLabel
          className="ml-4"
          control={
            <Checkbox
              checked={Boolean(activeFilters.formaturita)}
              onChange={(e) =>
                handleActiveFilterChange("formaturita", e.target.checked)
              }
            />
          }
          label="Maturitní"
          sx={{
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.secondary.main,
            },
          }}
        />
        <br />
        <FormControlLabel
          className="ml-4"
          control={
            <Checkbox
              checked={Boolean(activeFilters.new)}
              onChange={(e) =>
                handleActiveFilterChange("new", e.target.checked)
              }
            />
          }
          label="Nová"
          sx={{
            color: theme.palette.primary.main,
            "&.Mui-checked": {
              color: theme.palette.secondary.main,
            },
          }}
        />
        <br />
        <Box className="w-full flex justify-center">
          <SecondaryButton
            className="mt-9 p-2 "
            onClick={() => {
              setOpenSearcher(!isOpenSearcher);
            }}
          >
            <IconButton>
              <SearchIcon />
            </IconButton>{" "}
            <Typography variant="h6">Prohlédnout Knihy</Typography>
          </SecondaryButton>
        </Box>
      </Paper>
    </Slide>
  );
};
//
// const [debouncedFilters, setDebouncedFilters] =
//   useState<Filters>(activeFilters);
// const debouncedActiveFilters = useDebounce(debouncedFilters, 500); // Adjust the delay as needed
// useEffect(() => {
//   console.log(debouncedActiveFilters)
//   changePage(1)
//   setActiveFilters(debouncedActiveFilters);
// }, [debouncedActiveFilters]);
//
