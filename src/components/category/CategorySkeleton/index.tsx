import styles from './index.module.scss';

export default function CategorySkeleton() {
  return (
    <div className={styles.page}>
      <div className="container">
        {/* Skeleton Title */}
        <div className={styles.skeletonTitle}></div>

        {/* Skeleton Main Grid */}
        <div className={styles.mainGrid}>
          {/* Hero Skeleton */}
          <div className={styles.heroColumn}>
            <div className={styles.skeletonHeroImage}></div>
            <div className={styles.skeletonAccent}></div>
            <div className={styles.skeletonLine} style={{ width: '90%', height: '28px', marginBottom: '8px' }}></div>
            <div className={styles.skeletonLine} style={{ width: '70%', height: '28px', marginBottom: '12px' }}></div>
            <div className={styles.skeletonLine} style={{ width: '100%', height: '16px', marginBottom: '6px' }}></div>
            <div className={styles.skeletonLine} style={{ width: '85%', height: '16px', marginBottom: '12px' }}></div>
            <div className={styles.skeletonLine} style={{ width: '80px', height: '14px' }}></div>
          </div>

          {/* Center Skeleton */}
          <div className={styles.centerColumn}>
            <div>
              <div className={styles.skeletonTopImage}></div>
              <div className={styles.skeletonLine} style={{ width: '100%', height: '20px', marginBottom: '8px' }}></div>
              <div className={styles.skeletonLine} style={{ width: '60%', height: '13px' }}></div>
            </div>

            <div className={styles.newsList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonListCard}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.skeletonLine} style={{ width: '100%', height: '15px', marginBottom: '8px' }}></div>
                    <div className={styles.skeletonLine} style={{ width: '70%', height: '15px', marginBottom: '8px' }}></div>
                    <div className={styles.skeletonLine} style={{ width: '60px', height: '12px' }}></div>
                  </div>
                  <div className={styles.skeletonListImage}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Skeleton */}
          <div className={styles.rightColumn}>
            <div>
              <div className={styles.skeletonTopImage}></div>
              <div className={styles.skeletonLine} style={{ width: '100%', height: '20px', marginBottom: '8px' }}></div>
              <div className={styles.skeletonLine} style={{ width: '60%', height: '13px' }}></div>
            </div>

            <div className={styles.newsList}>
              {[1, 2, 3].map((i) => (
                <div key={i} className={styles.skeletonListCard}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.skeletonLine} style={{ width: '100%', height: '15px', marginBottom: '8px' }}></div>
                    <div className={styles.skeletonLine} style={{ width: '70%', height: '15px', marginBottom: '8px' }}></div>
                    <div className={styles.skeletonLine} style={{ width: '60px', height: '12px' }}></div>
                  </div>
                  <div className={styles.skeletonListImage}></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* More News Skeleton */}
        <section className={styles.moreSection}>
          <div className={styles.skeletonLine} style={{ width: '200px', height: '24px', marginBottom: '24px' }}></div>
          <div className={styles.moreGrid}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i}>
                <div className={styles.skeletonMoreImage}></div>
                <div className={styles.skeletonLine} style={{ width: '100%', height: '18px', marginBottom: '8px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '80%', height: '18px', marginBottom: '8px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '100%', height: '14px', marginBottom: '6px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '90%', height: '14px', marginBottom: '8px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '70px', height: '13px' }}></div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}