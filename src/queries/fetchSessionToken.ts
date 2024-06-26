import { useQuery, useQueryClient } from "react-query";
import { fetchFn } from "../helpers";
import { IFetchQueryOptions } from "./queries.types";

type IFetchSessionTokenResponse = {
  response_code: number;
  response_message: string;
  token: string;
};

async function fetchSessionToken() {
  const res = await fetchFn({
    endpoint: "api_token",
    queryParams: "?command=request",
  });
  return res.json();
}

export function useCreateSession(
  options: IFetchQueryOptions<IFetchSessionTokenResponse>
) {
  const queryClient = useQueryClient();

  const { isLoading, isError } = useQuery<IFetchSessionTokenResponse, Error>(
    "createSession",
    fetchSessionToken,
    options
  );

  return { isLoading, isError, queryClient };
}
