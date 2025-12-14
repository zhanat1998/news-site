// app/loading.tsx
import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeletonPage}>
      {/* Trending Bar Skeleton */}
      <div className={styles.skeletonTrending}>
        <div className={styles.skeletonTrendingLabel}></div>
        <div className={styles.skeletonTrendingText}></div>
      </div>

      <div className="container">
        {/* Date */}
        <div className={styles.skeletonDate}></div>

        {/* Hero Section Skeleton */}
        <div className={styles.skeletonHero}>
          {/* Left Column */}
          <div className={styles.skeletonHeroLeft}>
            <div className={styles.skeletonMainImage}></div>
            <div className={styles.skeletonAccent}></div>
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonTitle} style={{ width: '75%' }}></div>
            <div className={styles.skeletonExcerpt}></div>
            <div className={styles.skeletonExcerpt} style={{ width: '60%' }}></div>

            {/* Second Card */}
            <div className={styles.skeletonSecondCard}>
              <div className={styles.skeletonSecondContent}>
                <div className={styles.skeletonLine}></div>
                <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
                <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
              </div>
              <div className={styles.skeletonSecondImage}></div>
            </div>
          </div>

          {/* Center Column */}
          <div className={styles.skeletonHeroCenter}>
            <div className={styles.skeletonCenterMain}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine} style={{ width: '70%' }}></div>

            <div className={styles.skeletonCenterNews}>
              <div className={styles.skeletonCenterItem}>
                <div className={styles.skeletonCenterText}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
                </div>
                <div className={styles.skeletonCenterThumb}></div>
              </div>
              <div className={styles.skeletonCenterItem}>
                <div className={styles.skeletonCenterText}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
                </div>
                <div className={styles.skeletonCenterThumb}></div>
              </div>
            </div>

            <div className={styles.skeletonLinks}>
              <div className={styles.skeletonLinkItem}></div>
              <div className={styles.skeletonLinkItem}></div>
              <div className={styles.skeletonLinkItem}></div>
              <div className={styles.skeletonLinkItem}></div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.skeletonHeroRight}>
            <div className={styles.skeletonRightSection}>
              <div className={styles.skeletonSectionTitle}></div>
              <div className={styles.skeletonRightItem}>
                <div className={styles.skeletonRightThumb}></div>
                <div className={styles.skeletonRightText}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine} style={{ width: '80%' }}></div>
                </div>
              </div>
              <div className={styles.skeletonRightItem}>
                <div className={styles.skeletonRightThumb}></div>
                <div className={styles.skeletonRightText}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine} style={{ width: '70%' }}></div>
                </div>
              </div>
              <div className={styles.skeletonRightItem}>
                <div className={styles.skeletonRightThumb}></div>
                <div className={styles.skeletonRightText}>
                  <div className={styles.skeletonLine}></div>
                  <div className={styles.skeletonLine} style={{ width: '60%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}