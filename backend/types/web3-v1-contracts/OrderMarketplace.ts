/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import type BN from "bn.js";
import type { ContractOptions } from "web3-eth-contract";
import type { EventLog } from "web3-core";
import type { EventEmitter } from "events";
import type {
  Callback,
  PayableTransactionObject,
  NonPayableTransactionObject,
  BlockType,
  ContractEventLog,
  BaseContract,
} from "./types";

export interface EventOptions {
  filter?: object;
  fromBlock?: BlockType;
  topics?: string[];
}

export interface OrderMarketplace extends BaseContract {
  constructor(
    jsonInterface: any[],
    address?: string,
    options?: ContractOptions
  ): OrderMarketplace;
  clone(): OrderMarketplace;
  methods: {
    createOrder(
      items: [string, number | string | BN][]
    ): PayableTransactionObject<void>;

    confirmOrder(
      index: number | string | BN
    ): NonPayableTransactionObject<void>;

    cancelOrder(index: number | string | BN): NonPayableTransactionObject<void>;

    withdraw(amount: number | string | BN): NonPayableTransactionObject<void>;

    selfDestruct(): NonPayableTransactionObject<void>;

    traceOrdersByProductId(
      id: string
    ): NonPayableTransactionObject<
      [string, [string, string][], string, string][]
    >;

    getContractOwner(): NonPayableTransactionObject<string>;

    getOrderById(
      id: number | string | BN
    ): NonPayableTransactionObject<
      [string, [string, string][], string, string]
    >;

    getOrderCount(): NonPayableTransactionObject<string>;
  };
  events: {
    allEvents(options?: EventOptions, cb?: Callback<EventLog>): EventEmitter;
  };
}
