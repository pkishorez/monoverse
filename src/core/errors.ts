import { Data } from "effect";

export class FetchError extends Data.TaggedError("FetchError")<{
  message?: string;
}> {
  constructor(message = "Failed to fetch") {
    super({ message });
  }
}
