import { FC } from "react";
import useDocumentTitle from "./useDocumentTitle";

const About: FC = () => {
  useDocumentTitle("About");
  return (
    <div>
      <h1>About</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam vel
        sapien sollicitudin, malesuada libero eu, ornare nulla. Morbi volutpat
        dictum feugiat. Donec eget lobortis tellus. Phasellus volutpat convallis
        leo, vitae gravida justo euismod non. Morbi dui purus, lacinia sed neque
        vel, porta pretium est. Vivamus lorem leo, sagittis quis massa ac,
        sollicitudin egestas eros. Quisque congue lorem a leo euismod consequat.
        Fusce consequat ex et pharetra ultrices. Vestibulum a quam in risus
        bibendum lobortis. Ut aliquam interdum ornare. Donec vestibulum, ante
        quis mattis lacinia, odio tellus tincidunt neque, eu facilisis nisl est
        ut metus. Duis tristique felis ut placerat scelerisque. Proin vel libero
        sed mauris fringilla maximus. Etiam imperdiet neque quis ipsum rhoncus
        commodo. Proin ultrices massa sed nibh efficitur, vel tincidunt leo
        aliquet. In feugiat egestas nulla.
      </p>
    </div>
  );
};
export default About;
