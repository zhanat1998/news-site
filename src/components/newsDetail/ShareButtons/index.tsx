import styles from "./ShareButtons.module.scss";

const ShareButtons = () => {
  return <div className={styles.shareButtons}>
    <button className={styles.shareBtn}>
      <span>↗</span> Бөлүшүү
    </button>
    <button className={styles.saveBtn}>
      <span>🔖</span> Сактоо
    </button>
  </div>
}
export default ShareButtons;