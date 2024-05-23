type IFetchFn = {
  endpoint: string;
  queryParams?: string;
};

export function fetchFn({ endpoint, queryParams }: IFetchFn) {
  return fetch(
    `${import.meta.env.VITE_API_URL}/${endpoint}.php${queryParams || ""}`
  );
}
