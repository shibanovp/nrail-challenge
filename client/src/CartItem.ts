import { InventoryItem } from "./InventoryItem";

export type CartItem = {
  product: InventoryItem;
  amount: number;
};
