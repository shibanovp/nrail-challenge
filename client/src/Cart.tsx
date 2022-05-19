import { useState, FC } from "react";
import { Affix, Modal, Button } from "antd";
import { Table } from "antd";
import { CartItem } from "./CartItem";
export type CartProps = {
  items: CartItem[];
  onConfirm?(items: CartItem[]): void;
};

const Cart: FC<CartProps> = ({ items, onConfirm }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    onConfirm && onConfirm(items);
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

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
      render: (item: CartItem) =>
        `${(item.product.price * item.amount) / 100} €`,
    },
  ];
  const data = items.map((item) => ({ ...item, key: item.product.id }));

  return (
    <>
      <Affix offsetTop={0} style={{ float: "right" }}>
        <Button size="large" type="primary" danger onClick={showModal}>
          {items.length
            ? `${items.length} Products with ${items.reduce(
                (acc, item) => acc + item.amount,
                0
              )} items in Cart`
            : "Empty Cart"}
        </Button>
      </Affix>
      <Modal
        title="Your cart:"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            disabled={!items.length}
            onClick={handleOk}
          >
            Confirm order
          </Button>,
        ]}
      >
        <Table columns={columns} dataSource={data} />
      </Modal>
    </>
  );
};
export default Cart;
