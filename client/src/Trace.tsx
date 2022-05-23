import { FC, useState, useEffect } from "react";
import { Button, Table, Modal, Tag, List } from "antd";
import Web3 from "web3";
import { OrderMarketplace } from "backend/types/web3-v1-contracts/OrderMarketplace";
import { Order, OrderState } from "common";
import useDocumentTitle from "./useDocumentTitle";
import { InventoryItem } from "./InventoryItem";

export type TraceProps = {
  inventory: {
    items: InventoryItem[];
    isLoading: boolean;
  };
  instance: OrderMarketplace | null;
  web3: Web3 | null;
};
const Trace: FC<TraceProps> = ({ inventory, instance, web3 }) => {
  useDocumentTitle("Checkout");
  const [totalOrders, setTotalOrders] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [confirmInProgress, setConfirmInProgress] = useState(false);
  const [cancelInProgress, setCancelInProgress] = useState(false);

  useEffect(() => {
    const updateTotalOrders = async () => {
      const hasWeb3AndInstance = web3 && instance;
      if (!hasWeb3AndInstance) return;
      const totalOrders = await instance.methods.getOrderCount().call();
      setTotalOrders(web3.utils.toNumber(totalOrders));
    };
    updateTotalOrders();
  }, [web3, instance]);

  const columns = [
    {
      title: "Image",
      key: "image",
      render: (item: InventoryItem) => (
        <img alt={item.name} src={item.image} style={{ maxHeight: "70px" }} />
      ),
    },
    {
      title: "Trace",
      key: "trace",
      render: (item: InventoryItem) => (
        <div>
          <Button
            type="primary"
            onClick={async () => {
              if (!web3 || !instance) return;
              const id = web3.utils.utf8ToHex(item.id);
              const tracedOrders = await instance.methods
                .traceOrdersByProductId(id)
                .call();
              const orders: Order[] = tracedOrders.map(
                ([id, items, customer, state]) => ({
                  id: web3.utils.toNumber(id),
                  state: web3.utils.toNumber(state),
                  customer,
                  items: items.map(
                    ([id, amount]: [id: string, amount: string]) => ({
                      id: web3.utils.hexToUtf8(id),
                      amount: web3.utils.toNumber(amount),
                    })
                  ),
                })
              );
              setOrders(orders);
              showModal();
            }}
          >
            Trace Orders with {item.name}
          </Button>
        </div>
      ),
    },
  ];
  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleClose = () => {
    setIsModalVisible(false);
    setOrders([]);
  };

  const tracedColumns = [
    {
      title: "Customer",
      key: "customer",
      render: (order: Order) => (
        <a href={`https://ropsten.etherscan.io/address/${order.customer}`}>
          {order.customer.substring(0, 10)}
        </a>
      ),
    },
    {
      title: "Items",
      key: "items",
      render: (order: Order) => {
        const data = order.items.map((item) => `${item.amount} x ${item.id}`);
        return (
          <div>
            <List
              dataSource={data}
              renderItem={(item) => (
                <List.Item style={{ fontSize: "10px" }}>{item}</List.Item>
              )}
            />
          </div>
        );
      },
    },
    {
      title: "State",
      key: "state",
      render: (order: Order) => {
        switch (order.state) {
          case OrderState.Created:
            return <Tag color="yellow">Created</Tag>;
          case OrderState.Confirmed:
            return <Tag color="green">Confirmed</Tag>;
          case OrderState.Cancelled:
            return <Tag color="red">Cancelled</Tag>;
        }
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (order: Order) => (
        <div>
          {order.state === OrderState.Created && (
            <Button
              type="primary"
              style={{ marginBottom: "15px" }}
              block
              loading={confirmInProgress}
              onClick={async () => {
                if (!web3 || !instance) return;
                try {
                  setConfirmInProgress(true);
                  const accounts = await web3.eth.getAccounts();
                  await instance.methods
                    .confirmOrder(web3.utils.numberToHex(order.id))
                    .send({
                      from: accounts[0],
                    });
                } finally {
                  setConfirmInProgress(false);
                }
                handleClose();
              }}
            >
              Confirm Order
            </Button>
          )}
          {order.state === OrderState.Created && (
            <Button
              danger
              block
              loading={cancelInProgress}
              onClick={async () => {
                if (!web3 || !instance) return;
                setCancelInProgress(true);
                try {
                  const accounts = await web3.eth.getAccounts();
                  await instance.methods
                    .cancelOrder(web3.utils.numberToHex(order.id))
                    .send({
                      from: accounts[0],
                    });
                } finally {
                  setCancelInProgress(false);
                }
                handleClose();
              }}
            >
              Cancel Order
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 data-testid="header">Trace</h1>

      {!instance && !totalOrders && (
        <div>Loading Web3, accounts, and contract...</div>
      )}
      <div>There are {totalOrders} orders in a contract</div>
      <Table
        columns={columns}
        dataSource={inventory.items.map((item) => ({ ...item, key: item.id }))}
      />
      <Modal
        title="Traced orders"
        visible={isModalVisible}
        onCancel={handleClose}
        footer={[
          <Button key="close" onClick={handleClose}>
            Close
          </Button>,
        ]}
      >
        <Table
          columns={tracedColumns}
          dataSource={orders.map((order, index) => ({
            ...order,
            key: index,
          }))}
        />
      </Modal>
    </div>
  );
};
export default Trace;
