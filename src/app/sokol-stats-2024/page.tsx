'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';

interface PostStats {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  category: string;
  views: number;
  mainImage?: { asset?: { url?: string } };
}

interface DailyStats {
  date: string;
  count: number;
}

interface CountryStats {
  country: string;
  count: number;
}

interface AnalyticsData {
  period: string;
  totalViews: number;
  topPosts: PostStats[];
  dailyStats: DailyStats[];
  countryStats: CountryStats[];
}

// Environment variables аркылуу алынат
const SECRET_KEY = process.env.NEXT_PUBLIC_ANALYTICS_SECRET || '';
const DASHBOARD_PASSWORD = process.env.NEXT_PUBLIC_ANALYTICS_PASSWORD || '';

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Браузер эстеп калсын (localStorage)
  useEffect(() => {
    const savedAuth = localStorage.getItem('analytics_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('analytics_auth', 'true');
      setPasswordError('');
    } else {
      setPasswordError('Туура эмес пароль');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('analytics_auth');
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?secret=${SECRET_KEY}&period=${period}`);
        if (!response.ok) {
          if (response.status === 401) {
            setError('Уруксат жок. Туура эмес ачкыч.');
          } else {
            setError('Маалымат жүктөөдө ката чыкты');
          }
          return;
        }
        const result = await response.json();
        setData(result);
        setError('');
      } catch (err) {
        setError('Байланыш катасы');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [period, isAuthenticated]);

  // Пароль формасы
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1>Аналитика</h1>
          <p>Кирүү үчүн паролду киргизиңиз</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className={styles.passwordInput}
              autoFocus
            />
            {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
            <button type="submit" className={styles.loginButton}>
              Кирүү
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Жүктөлүүдө...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Жүктөлүүдө...</div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('ky-KG', {
      day: 'numeric',
      month: 'short',
    });
  };

  const maxDailyViews = Math.max(...data.dailyStats.map(d => d.count), 1);

  const countryNames: Record<string, string> = {
    KG: 'Кыргызстан',
    RU: 'Россия',
    KZ: 'Казакстан',
    UZ: 'Өзбекстан',
    US: 'АКШ',
    DE: 'Германия',
    TR: 'Түркия',
    Unknown: 'Белгисиз',
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Аналитика</h1>
        <div className={styles.headerRight}>
          <div className={styles.periodSelector}>
            <button
              className={period === 'today' ? styles.active : ''}
              onClick={() => setPeriod('today')}
            >
              Бүгүн
            </button>
            <button
              className={period === 'week' ? styles.active : ''}
              onClick={() => setPeriod('week')}
            >
              Жума
            </button>
            <button
              className={period === 'month' ? styles.active : ''}
              onClick={() => setPeriod('month')}
            >
              Ай
            </button>
          </div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Чыгуу
          </button>
        </div>
      </header>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.totalViews.toLocaleString()}</div>
          <div className={styles.statLabel}>Жалпы көрүүлөр</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{data.topPosts.length}</div>
          <div className={styles.statLabel}>Окулган посттор</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {data.dailyStats.length > 0
              ? Math.round(data.totalViews / data.dailyStats.length)
              : 0}
          </div>
          <div className={styles.statLabel}>Орточо/күн</div>
        </div>
      </div>

      {/* Күндүк график */}
      <section className={styles.section}>
        <h2>Күнү боюнча көрүүлөр</h2>
        <div className={styles.chart}>
          {data.dailyStats.map((day) => (
            <div key={day.date} className={styles.barContainer}>
              <div
                className={styles.bar}
                style={{ height: `${(day.count / maxDailyViews) * 100}%` }}
              >
                <span className={styles.barValue}>{day.count}</span>
              </div>
              <span className={styles.barLabel}>{formatDate(day.date)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Эң популярдуу посттор */}
      <section className={styles.section}>
        <h2>Эң популярдуу посттор</h2>
        <div className={styles.postList}>
          {data.topPosts.map((post, index) => (
            <div key={post._id} className={styles.postItem}>
              <span className={styles.rank}>{index + 1}</span>
              <div className={styles.postInfo}>
                <a
                  href={`/news/${post.publishedAt?.split('T')[0]}/${post.slug?.current}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.postTitle}
                >
                  {post.title}
                </a>
                <div className={styles.postMeta}>
                  {post.category && <span className={styles.category}>{post.category}</span>}
                  <span className={styles.date}>
                    {post.publishedAt && formatDate(post.publishedAt)}
                  </span>
                </div>
              </div>
              <div className={styles.views}>
                <span className={styles.viewCount}>{post.views}</span>
                <span className={styles.viewLabel}>көрүү</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Өлкөлөр */}
      {data.countryStats.length > 0 && (
        <section className={styles.section}>
          <h2>Өлкөлөр боюнча</h2>
          <div className={styles.countryList}>
            {data.countryStats.map((country) => (
              <div key={country.country} className={styles.countryItem}>
                <span className={styles.countryName}>
                  {countryNames[country.country] || country.country}
                </span>
                <div className={styles.countryBar}>
                  <div
                    className={styles.countryBarFill}
                    style={{
                      width: `${(country.count / data.countryStats[0].count) * 100}%`,
                    }}
                  />
                </div>
                <span className={styles.countryCount}>{country.count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <footer className={styles.footer}>
        <p>Бул барак сизге гана көрүнөт. Шилтемени башкаларга бербеңиз.</p>
      </footer>
    </div>
  );
}