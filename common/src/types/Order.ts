import { OrderItem } from "./OrderItem";

export enum OrderState {
  Created = 0,
  Confirmed = 1,
  Cancelled = 2,
}

export type Order = {
  id: number;
  state: OrderState;
  customer: string;
  items: OrderItem[];
};
