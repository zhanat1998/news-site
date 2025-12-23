import styles from "./MainContainer.module.scss";
import {MainContainerProps} from "@/types";
import NewYearDecoration from "@/components/ui/MainContainer/components/NewYearDecoration/NewYearDecoration";

const MainContainer = ({ children }: MainContainerProps) => {
  return (
    <div className={styles.page}>
      {/*<NewYearDecoration />*/}
      <div className="container">
        {children}
      </div>
    </div>
  );
};

export default MainContainer;