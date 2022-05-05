import { FC, useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Shop from "./Shop";
import About from "./About";
import Cart from "./Cart";
import { CartItem } from "./CartItem";
import "./App.css";

const { Header, Content, Footer } = Layout;

const App: FC = () => {
  const { pathname } = useLocation();
  const [cart, setCart] = useState<CartItem[]>([]);

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
      element: <Shop cart={cart} onAddToCart={onAddToCart} />,
    },
    { label: "About", href: "/about", element: <About /> },
  ];

  const items: MenuProps["items"] = routes.map((item) => ({
    label: <Link to={item.href}>{item.label}</Link>,
    key: item.href,
  }));

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
          <Cart items={cart} />
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <div className="site-layout-content" data-testid="content">
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
