import { RequestHandler } from 'express';
import { Query, Dictionary, ParamsDictionary } from 'express-serve-static-core';

export enum ERROR_CODES {
    UNAUTHORIZED = 'UNAUTHORIZED',
    BAD_USER_INPUT = 'BAD_USER_INPUT',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
}

export interface DataResponseBody {
    data: Dictionary<any>;
}

export interface ErrorResponseBody {
    errors: {
        errorCode?: keyof typeof ERROR_CODES;
        msg: string;
        param?: string;
    }[];
}

export interface TypedRequestHandler<
    B extends Dictionary<any> = Dictionary<any>,
    Q extends Query = Query,
    P extends ParamsDictionary = ParamsDictionary,
> extends RequestHandler<P, DataResponseBody | ErrorResponseBody, B, Q> {}
