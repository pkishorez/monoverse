import { Data } from "effect";

export const ErrorClass = (tag: string) =>
  class extends Data.TaggedError(tag)<{
    message?: string;
    meta?: unknown;
  }> {
    constructor(message = "An error occurred", meta?: unknown) {
      super({ message, meta });
    }
  };

export class InvalidFilesystemPath extends ErrorClass("InvalidPath") {}
export class FetchError extends ErrorClass("FetchError") {}
