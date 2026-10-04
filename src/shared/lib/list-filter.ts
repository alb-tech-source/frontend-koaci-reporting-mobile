import { isWithinDateRange, type DateMode } from "./date-range";

export interface ListFilter {
  search: string;
  project: string;
  dateStart: string;
  dateEnd: string;
}

export const emptyListFilter: ListFilter = {
  search: "",
  project: "",
  dateStart: "",
  dateEnd: "",
};

interface FilterableItem {
  projectKey: string;
  companyName: string;
  date: string;
}

export function matchesListFilter(
  item: FilterableItem,
  filter: ListFilter,
  dateMode: DateMode = "local",
): boolean {
  const query = filter.search.trim().toLowerCase();

  const matchSearch =
    !query ||
    item.projectKey.toLowerCase().includes(query) ||
    item.companyName.toLowerCase().includes(query);
  const matchProject = !filter.project || item.projectKey === filter.project;

  return (
    matchSearch &&
    matchProject &&
    isWithinDateRange(item.date, filter.dateStart, filter.dateEnd, dateMode)
  );
}
