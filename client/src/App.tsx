import { FC, useState, useEffect } from "react";
import { Layout, Menu, MenuProps, message, Alert } from "antd";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import OrderMarketplaceCompiled from "backend/build/contracts/OrderMarketplace.json";
import { OrderMarketplace } from "backend/types/web3-v1-contracts/OrderMarketplace";
import Shop from "./Shop";
import About from "./About";
import Checkout from "./Checkout";
import Trace from "./Trace";
import Cart from "./Cart";
import { CartItem } from "./CartItem";
import { InventoryItem } from "./InventoryItem";
import "./App.css";
const baseUrl = process.env.REACT_APP_INVENTORY_BASE_URL;
const targetNetworkId = Number(process.env.REACT_APP_NETWORK_ID);

const { Header, Content, Footer } = Layout;

const App: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  const [inventory, setInventory] = useState<{
    items: InventoryItem[];
    isLoading: boolean;
  }>({
    items: [],
    isLoading: true,
  });

  const [instance, setInstance] = useState(null as OrderMarketplace | null);
  const [web3, setWeb3] = useState(null as Web3 | null);
  const [networkId, setNetworkId] = useState(NaN);

  const onAddToCart = (item: CartItem) => {
    const newCart = [...cart];
    const existingItem = newCart.find(
      (cartItem) => cartItem.product.id === item.product.id
    );
    if (existingItem) {
      existingItem.amount += item.amount;
    } else {
      newCart.push(item);
    }
    setCart(newCart);
  };

  const routes = [
    {
      label: "Home",
      href: "/",
      element: (
        <Shop inventory={inventory} cart={cart} onAddToCart={onAddToCart} />
      ),
    },
    { label: "About", href: "/about", element: <About /> },
  ];
  const traceRoute = {
    label: "Trace",
    href: "/trace",
    element: <Trace inventory={inventory} instance={instance} web3={web3} />,
  };
  const checkoutRoute = {
    label: "Checkout",
    href: "/checkout",
    element: (
      <Checkout
        cart={cart}
        instance={instance}
        web3={web3}
        onPaymentSuccess={() => {
          setCart([]);
          message.success(`You created the order!`);
          navigate(traceRoute.href);
        }}
      />
    ),
  };
  if (cart.length) {
    routes.push(checkoutRoute);
  }
  if (instance) {
    routes.push(traceRoute);
  }
  const items: MenuProps["items"] = routes.map((item) => ({
    label: <Link to={item.href}>{item.label}</Link>,
    key: item.href,
  }));
  useEffect(() => {
    const getInventoryItems = async () => {
      const response = await fetch(`${baseUrl}/inventory`);
      const json = await response.json();
      setInventory({ items: json, isLoading: false });
    };
    getInventoryItems();
  }, []);

  useEffect(() => {
    const web3Init = async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
        setWeb3(web3);
        const networkId = await web3.eth.net.getId();
        setNetworkId(networkId);

        const deployedNetwork = (OrderMarketplaceCompiled.networks as any)[
          networkId
        ];

        const instance = new web3.eth.Contract(
          OrderMarketplaceCompiled.abi as AbiItem[],
          deployedNetwork?.address
        ) as unknown as OrderMarketplace;
        setInstance(instance);
      }
    };
    web3Init().catch(console.log);
  }, []);

  return (
    <>
      <Layout className="layout">
        <Header style={{ marginBottom: "20px" }}>
          <div className="logo" />
          <Menu
            theme="dark"
            mode="horizontal"
            items={items}
            selectedKeys={[pathname]}
          ></Menu>
          <Cart items={cart} onConfirm={() => navigate(checkoutRoute.href)} />
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content" data-testid="content">
            {instance && targetNetworkId !== networkId && (
              <Alert
                message="Please switch to ropsten network"
                type="error"
                showIcon
              />
            )}
            <Routes>
              {routes.map(({ href, element }) => (
                <Route key={href} path={href} element={element} />
              ))}
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>©2022</Footer>
      </Layout>
    </>
  );
};

export default App;
