import { useState, FC } from "react";
import { Affix, Modal, Button } from "antd";
import { Table } from "antd";
import { CartItem } from "./CartItem";
export type CounterProps = {
  items: CartItem[];
};

const Cart: FC<CounterProps> = ({ items }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
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
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Table columns={columns} dataSource={data} />
      </Modal>
    </>
  );
};
export default Cart;
