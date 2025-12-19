import styles from "./MainContainer.module.scss";
import {MainContainerProps} from "@/types";

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className={styles.page}>
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default MainContainer;