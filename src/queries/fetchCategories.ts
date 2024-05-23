import { useQuery } from "react-query";
import { fetchFn } from "../helpers";
import { IFetchQueryOptions } from "./queries.types";

type IFetchCategoriesResponse = {
  trivia_categories: Array<{
    id: number;
    name: string;
  }>;
};

async function fetchCategories() {
  const res = await fetchFn({
    endpoint: "api_category",
  });
  return res.json();
}

export function useFetchCategories(
  options: IFetchQueryOptions<IFetchCategoriesResponse>
) {
  return useQuery<IFetchCategoriesResponse, Error>(
    "fetchCategories",
    fetchCategories,
    options
  );
}
