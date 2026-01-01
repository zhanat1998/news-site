import styles from './loading.module.scss';

export default function Loading() {
  return (
    <div className={styles.skeleton}>
      <div className={styles.layout}>
        {/* Main Content */}
        <div className={styles.main}>
          <div className={styles.player}></div>
          <div className={styles.info}>
            <div className={styles.category}></div>
            <div className={styles.title}></div>
            <div className={styles.title} style={{ width: '70%' }}></div>
            <div className={styles.description}>
              <div className={styles.line}></div>
              <div className={styles.line} style={{ width: '90%' }}></div>
              <div className={styles.line} style={{ width: '80%' }}></div>
            </div>
            <div className={styles.meta}></div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}></div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={styles.sidebarCard}>
              <div className={styles.sidebarThumb}></div>
              <div className={styles.sidebarContent}>
                <div className={styles.line}></div>
                <div className={styles.line} style={{ width: '80%' }}></div>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
}