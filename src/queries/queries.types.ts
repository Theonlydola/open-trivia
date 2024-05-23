// import { MutationFunction } from "react-query";

import { UseMutationOptions } from "react-query";

export type IFetchQueryOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  manual?: boolean;
  enabled?: boolean;
  refetchOnWindowFocus?: boolean;
};

export type IMutationCallback<T> =
  | Omit<UseMutationOptions<T, unknown, T, unknown>, "createSession">
  | undefined;
