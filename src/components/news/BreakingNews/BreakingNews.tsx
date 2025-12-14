"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDateForUrl } from "@/utils/date";
import styles from "./BreakingNews.module.scss";
import { Posts } from "@/types/posts";

const BreakingNews = ({ items }: Posts) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeAgo, setTimeAgo] = useState("");

  // ✅ 20 гана алуу
  const limitedItems = items.slice(0, 20);

  useEffect(() => {
    if (limitedItems.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % limitedItems.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [limitedItems.length]);

  useEffect(() => {
    const updateTime = () => {
      const current = limitedItems[currentIndex];
      if (!current?.publishedAt) return;

      const diff = Date.now() - new Date(current.publishedAt).getTime();
      const minutes = Math.floor(diff / 60000);
      const hours = Math.floor(diff / 3600000);

      if (minutes < 1) {
        setTimeAgo("Жаңы эле");
      } else if (minutes < 60) {
        setTimeAgo(`${minutes} мүн мурун`);
      } else if (hours < 24) {
        setTimeAgo(`${hours} саат мурун`);
      } else {
        setTimeAgo(`${Math.floor(hours / 24)} күн мурун`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [currentIndex, limitedItems]);

  if (!limitedItems || limitedItems.length === 0) return null;

  const current = limitedItems[currentIndex];

  return (
    <div className={styles.breakingNews}>
      <div className="container">
        <div className={styles.inner}>
          <div className={styles.label}>
            <span className={styles.pulse}></span>
            <span className={styles.text}>ШАШЫЛЫШ</span>
          </div>

          <div className={styles.timer}>
            <svg className={styles.timerIcon} viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span>{timeAgo}</span>
          </div>

          <Link
            href={`/news/${formatDateForUrl(current.publishedAt)}/${current.slug?.current}`}
            className={styles.title}
          >
            {current.title}
          </Link>

          {limitedItems.length > 1 && (
            <div className={styles.pagination}>
              {limitedItems.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${index === currentIndex ? styles.active : ""}`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BreakingNews;