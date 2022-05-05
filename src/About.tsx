import { FC } from "react";
import useDocumentTitle from "./useDocumentTitle";

const About: FC = () => {
  useDocumentTitle("About");
  return (
    <div>
      <h1>About</h1>
    </div>
  );
};
export default About;
