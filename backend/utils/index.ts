import { Order, OrderItem } from "common";

export function orderItemtoHex(item: OrderItem): {
  id: string;
  amount: string | number | BN;
} {
  return {
    id: web3.utils.utf8ToHex(item.id),
    amount: web3.utils.numberToHex(item.amount),
  };
}

export function hexToOrderItem(item: { id: string; amount: BN }): OrderItem {
  return {
    id: web3.utils.hexToUtf8(item.id),
    amount: web3.utils.toNumber(item.amount),
  };
}
function hexToOrder({
  id,
  items,
  customer,
  state,
}: {
  id: BN;
  items: { id: string; amount: BN }[];
  customer: string;
  state: BN;
}): Order {
  return {
    id: web3.utils.toNumber(id),
    items: items.map(hexToOrderItem),
    customer,
    state: web3.utils.toNumber(state),
  };
}
export default { orderItemtoHex, hexToOrderItem, truffle: { hexToOrder } };
