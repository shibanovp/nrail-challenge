import { FC } from "react";
import { Table } from "antd";
import { CartItem } from "./CartItem";

const columns = [
  {
    title: "Name",
    key: "name",
    render: (item: CartItem) => item.product.name,
  },
  {
    title: "Description",
    key: "description",
    render: (item: CartItem) => item.product.description,
  },
  {
    title: "Amount",
    key: "amount",
    render: (item: CartItem) => item.amount,
  },
  {
    title: "Total",
    key: "amount",
    render: (item: CartItem) => `${(item.product.price * item.amount) / 100} €`,
  },
];

export type OrderTableProps = {
  items: CartItem[];
};

const OrderTable: FC<OrderTableProps> = ({ items }) => {
  const data = items.map((item) => ({ ...item, key: item.product.id }));
  return <Table data-testid="table" columns={columns} dataSource={data} />;
};

export default OrderTable;
