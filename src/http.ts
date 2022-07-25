import { flow } from "fp-ts/function";
import { errorResponse as httpErrorResponse } from "@pagopa/handler-kit/lib/http";

import { NotFoundError } from "@pagopa/handler-kit/lib/http/errors";

const tryToHttpResponse = (e: Error) => {
  if (e.name === "UserNotFoundError") {
    return new NotFoundError(e.message);
  }
  return e;
};

export const errorResponse = flow(tryToHttpResponse, httpErrorResponse);
