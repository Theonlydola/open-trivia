import { QueryKey, useQuery } from "react-query";
import { fetchFn } from "../helpers";
import { IFetchQueryOptions } from "./queries.types";
import { DIFFICULTY } from "../contexts";

export type IQuestion = {
  category: string;
  type: "multiple" | "boolean";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  correct_answer: string;
  incorrect_answers: Array<string>;
};

type IFetchQuestionsResponse = {
  response_code: 0 | 1 | 2 | 3 | 4;
  results: IQuestion[];
};

type IFetchQuestionsQueryParams = {
  amount: number;
  category?: number;
  difficulty?: DIFFICULTY;
  token?: string;
};

async function fetchQuestions({
  queryKey,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryKey: any;
}): Promise<IFetchQuestionsResponse> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, params] = queryKey;
  const res = await fetchFn({
    endpoint: "api",
    queryParams: `?amount=${params?.amount}&category=${params?.category}&difficulty=${params?.difficulty}&token=${params?.token}`,
  });

  if (!res.ok) throw new Error("Something went wrong");
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
      return data;
  }
}

export function useFetchQuestions(
  queryParams: IFetchQuestionsQueryParams,
  options?: IFetchQueryOptions<IFetchQuestionsResponse>
) {
  const queryKey = ["fetchQuestions", queryParams];
  return useQuery<
    IFetchQuestionsResponse,
    Error,
    IFetchQuestionsResponse,
    QueryKey
  >(queryKey, fetchQuestions, options);
}
