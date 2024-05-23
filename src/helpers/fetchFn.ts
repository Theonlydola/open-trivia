type IFetchFn = {
  endpoint: string;
  queryParams?: string;
};

export async function fetchFn({ endpoint, queryParams }: IFetchFn) {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/${endpoint}.php${queryParams || ""}`
  );

  if (res.ok) {
    const data = await res.json();
    switch (data.response_code) {
      case 5:
        throw new Error("Too Many Requests");
      case 4:
        throw new Error(
          "Session Token has returned all possible questions for the specified query."
        );
      case 3:
        throw new Error("Session Token does not exist.");
      case 2:
        throw new Error("Invalid Parameters");
      case 1:
        throw new Error("No results");
      default:
        return res;
    }
  }
  return res;
}
