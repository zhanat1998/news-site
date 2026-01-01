import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeleton}>
      <div className="container">
        <div className={styles.header}>
          <div className={styles.title}></div>
        </div>

        <div className={styles.adPlaceholder}></div>

        <div className={styles.sectionTitle}></div>
        <div className={styles.grid}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={styles.card}>
              <div className={styles.thumbnail}></div>
              <div className={styles.cardContent}>
                <div className={styles.line}></div>
                <div className={styles.line} style={{ width: '70%' }}></div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.sectionTitle} style={{ marginTop: '48px' }}></div>
        <div className={styles.instagramGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className={styles.instagramCard}></div>
          ))}
        </div>
      </div>
    </div>
  );
}