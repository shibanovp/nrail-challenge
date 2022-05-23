import { FC } from "react";
import { Card, Col, Row, Button, Select, Form } from "antd";

import useDocumentTitle from "./useDocumentTitle";
import { InventoryItem } from "./InventoryItem";
import { CartItem } from "./CartItem";

const { Meta } = Card;
const { Option } = Select;

type AddToCartFormProps = {
  item: InventoryItem;
  onAddToCart: (item: CartItem) => void;
  inCart: CartItem | undefined;
};

const AddToCartForm: FC<AddToCartFormProps> = ({
  item,
  onAddToCart,
  inCart,
}) => {
  const [form] = Form.useForm();
  const isDisabled = item.amountAvaliable - (inCart?.amount ?? 0) <= 0;
  return (
    <Form
      form={form}
      name="basic"
      layout="inline"
      style={{ width: "100%", justifyContent: "center" }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ amount: 1 }}
      onFinish={({ amount }: { amount: number }) => {
        onAddToCart({
          product: item,
          amount,
        });
        form.resetFields();
      }}
    >
      <Form.Item name="amount">
        <Select size="large" style={{ width: 120 }} disabled={isDisabled}>
          {Array.from(
            Array(
              inCart
                ? item.amountAvaliable - inCart.amount
                : item.amountAvaliable
            ).keys()
          )
            .map((i) => i + 1)
            .map((amount) => (
              <Option key={amount} value={amount}>
                {amount}
              </Option>
            ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          size="large"
          htmlType="submit"
          disabled={isDisabled}
        >
          Add to cart
        </Button>
      </Form.Item>
    </Form>
  );
};

export type ShopProps = {
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  inventory: {
    items: InventoryItem[];
    isLoading: boolean;
  };
};

const Shop: FC<ShopProps> = ({ cart, onAddToCart, inventory }) => {
  useDocumentTitle("🚆 Shop");

  return (
    <>
      <h1>Shop</h1>
      <div className="site-card-wrapper">
        {inventory.isLoading ? (
          <p>Loading...</p>
        ) : (
          <Row gutter={16}>
            {inventory.items.map((item) => {
              const inCart = cart.find((i) => i.product.id === item.id);

              return (
                <Col md={8} key={item.id} style={{ display: "flex" }}>
                  <Card
                    className="flexible-card"
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      marginBottom: "1rem",
                    }}
                    cover={
                      <img
                        alt={item.name}
                        src={item.image}
                        style={{ maxHeight: "300px" }}
                      />
                    }
                    actions={[
                      <AddToCartForm
                        item={item}
                        onAddToCart={onAddToCart}
                        inCart={inCart}
                      />,
                    ]}
                  >
                    <Meta title={`${item.price / 100} €`} />
                    <Meta title={item.name} description={item.description} />
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}
      </div>
    </>
  );
};
export default Shop;
