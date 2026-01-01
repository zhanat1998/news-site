import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeleton}>
      <div className="container">
        <div className={styles.layout}>
          {/* Main Content */}
          <article className={styles.article}>
            {/* Title */}
            <div className={styles.title}></div>
            <div className={styles.title} style={{ width: '70%' }}></div>

            {/* Subtitle */}
            <div className={styles.subtitle}></div>
            <div className={styles.subtitle} style={{ width: '85%' }}></div>

            {/* Main Image */}
            <div className={styles.image}></div>

            {/* Author */}
            <div className={styles.author}>
              <div className={styles.avatar}></div>
              <div className={styles.authorInfo}>
                <div className={styles.line} style={{ width: '100px' }}></div>
                <div className={styles.line} style={{ width: '80px' }}></div>
              </div>
            </div>

            {/* Content */}
            <div className={styles.content}>
              <div className={styles.line}></div>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '95%' }}></div>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '90%' }}></div>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '85%' }}></div>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '75%' }}></div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className={styles.sidebar}>
            <div className={styles.adPlaceholder}></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.sidebarCard}>
                <div className={styles.sidebarImage}></div>
                <div className={styles.line}></div>
                <div className={styles.line} style={{ width: '80%' }}></div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </div>
  );
}