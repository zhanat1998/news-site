import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeleton}>
      <div className="container">
        <div className={styles.title}></div>
        <div className={styles.subtitle}></div>

        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.image}></div>
              <div className={styles.cardContent}>
                <div className={styles.line}></div>
                <div className={styles.line} style={{ width: '80%' }}></div>
                <div className={styles.lineMeta}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}