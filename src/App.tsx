import { FC } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Shop from "./Shop";
import About from "./About";
import "./App.css";

const { Header, Content, Footer } = Layout;

const routes = [
  { label: "Home", href: "/", element: <Shop /> },
  { label: "About", href: "/about", element: <About /> },
];

const items: MenuProps["items"] = routes.map((item) => ({
  label: <Link to={item.href}>{item.label}</Link>,
  key: item.href,
}));

const App: FC = () => {
  const { pathname } = useLocation();
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={items}
          selectedKeys={[pathname]}
        ></Menu>
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
  );
};

export default App;
