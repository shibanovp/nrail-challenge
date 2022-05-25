import React, { FC, useEffect } from "react";
import { Layout, Menu, Breadcrumb, Switch, Divider } from "antd";
import "./App.css";
const { Content, Header, Footer } = Layout;

const baseUrl = process.env.REACT_APP_ESP_HOST;

type IsOnResponse = {
  data: { isOn: boolean };
};
type PinsResponse = {
  data: { pins: number[] };
};
type PinState = { [key: number]: boolean };

const pinColorClasses: { [key: number]: string } = {
  4: "switch-green",
  5: "switch-red",
};

const App: FC = () => {
  const [pins, setPins] = React.useState<number[]>([]);
  const [ledsIsOn, setLedIsOn] = React.useState<PinState>({});
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    const syncLedState = async () => {
      const result = await fetch(`${baseUrl}/pins`, { signal });
      const {
        data: { pins },
      }: PinsResponse = await result.json();
      setPins(pins);
      const newState: PinState = {};
      for (const pin of pins) {
        const result = await fetch(
          `${baseUrl}/is-on?${new URLSearchParams({ pin: pin.toString() })}`,
          { signal }
        );
        const {
          data: { isOn },
        }: IsOnResponse = await result.json();
        newState[pin] = isOn;
      }

      setLedIsOn(newState);
    };
    syncLedState();
    return () => controller.abort();
  }, []);
  const onChange = async (pin: number) => {
    const response = await fetch(
      `${baseUrl}/toggle?${new URLSearchParams({ pin: pin.toString() })}`,
      { method: "POST" }
    );
    const {
      data: { isOn },
    }: IsOnResponse = await response.json();
    setLedIsOn({ ...ledsIsOn, [pin]: isOn });
  };
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          items={[{ key: "home", label: "ESP 8266 State" }]}
        />
      </Header>
      <Content style={{ padding: "100px 50px" }}>
        <div style={{ textAlign: "center" }} className="site-layout-content">
          {pins.map((pin) => (
            <div key={pin} className={`${pinColorClasses[pin]}`}>
              <h4>Pin: {pin}</h4>
              <Switch checked={ledsIsOn[pin]} onChange={() => onChange(pin)} />
              <Divider />
            </div>
          ))}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>©2022</Footer>
    </Layout>
  );
};

export default App;
