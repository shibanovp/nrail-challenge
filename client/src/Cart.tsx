import { useState, FC } from "react";
import { Affix, Modal, Button } from "antd";
import OrderTable from "./OrderTable";
import { CartItem } from "./CartItem";
export type CartProps = {
  items: CartItem[];
  onConfirm?(): void;
};

const Cart: FC<CartProps> = ({ items, onConfirm }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    onConfirm && onConfirm();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Affix offsetTop={0} style={{ float: "right" }}>
        <Button
          style={{ zIndex: 1 }}
          size="large"
          type="primary"
          danger
          onClick={showModal}
        >
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
            Checkout
          </Button>,
        ]}
      >
        <OrderTable items={items} />
      </Modal>
    </>
  );
};
export default Cart;
