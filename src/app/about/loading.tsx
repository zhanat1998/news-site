import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeleton}>
      <div className="container">
        <div className={styles.title}></div>
        <div className={styles.content}>
          <div className={styles.line}></div>
          <div className={styles.line} style={{ width: '90%' }}></div>
          <div className={styles.line} style={{ width: '85%' }}></div>
          <div className={styles.line} style={{ width: '95%' }}></div>
          <div className={styles.line} style={{ width: '80%' }}></div>
        </div>
      </div>
    </div>
  );
}