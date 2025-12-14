// app/news/[date]/loading.tsx
import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeletonContainer}>
      <div className="container">
        <div className={styles.skeletonLayout}>
          {/* Main Content Skeleton */}
          <div className={styles.skeletonArticle}>
            {/* Breadcrumb */}
            <div className={styles.skeletonBreadcrumb}>
              <div className={styles.skeletonLine} style={{ width: '80px' }}></div>
              <div className={styles.skeletonLine} style={{ width: '60px' }}></div>
            </div>

            {/* Title */}
            <div className={styles.skeletonTitle}></div>
            <div className={styles.skeletonTitle} style={{ width: '70%' }}></div>

            {/* Subtitle */}
            <div className={styles.skeletonSubtitle}></div>
            <div className={styles.skeletonSubtitle} style={{ width: '85%' }}></div>

            {/* Image */}
            <div className={styles.skeletonImage}></div>

            {/* Meta */}
            <div className={styles.skeletonMeta}>
              <div className={styles.skeletonAvatar}></div>
              <div>
                <div className={styles.skeletonLine} style={{ width: '100px' }}></div>
                <div className={styles.skeletonLine} style={{ width: '80px' }}></div>
              </div>
            </div>

            {/* Content */}
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine} style={{ width: '90%' }}></div>
              <div className={styles.skeletonLine}></div>
              <div className={styles.skeletonLine} style={{ width: '75%' }}></div>
            </div>
          </div>

          {/* Sidebar Skeleton */}
          <div className={styles.skeletonSidebar}>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
            <div className={styles.skeletonCard}></div>
          </div>
        </div>
      </div>
    </div>
  );
}