import { FC } from "react";
import useDocumentTitle from "./useDocumentTitle";

const Shop: FC = () => {
  useDocumentTitle("🚆 Shop");
  return (
    <div>
      <h1>Shop</h1>
    </div>
  );
};
export default Shop;
