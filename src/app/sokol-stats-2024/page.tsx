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

export default function AnalyticsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Аутентификация текшерүү
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/analytics-auth');
        const result = await response.json();
        setIsAuthenticated(result.authenticated);
      } catch {
        setIsAuthenticated(false);
      }
    }
    checkAuth();
  }, []);

  // Login - серверде текшерилет
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setPasswordError('');

    try {
      const response = await fetch('/api/analytics-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        const result = await response.json();
        setPasswordError(result.error || 'Ката чыкты');
      }
    } catch {
      setPasswordError('Байланыш катасы');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/analytics-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setIsAuthenticated(false);
      setData(null);
    } catch {
      // ignore
    }
  };

  // Маалыматтарды жүктөө
  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`/api/analytics?period=${period}`);
        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false);
            return;
          }
          setError('Маалымат жүктөөдө ката чыкты');
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

  // Жүктөлүүдө
  if (isAuthenticated === null) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Текшерилүүдө...</div>
      </div>
    );
  }

  // Пароль формасы
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h1>Аналитика</h1>
          <p>Кирүү үчүн паролду киргизиңиз</p>
          <form onSubmit={handleLogin}>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Пароль"
                className={styles.passwordInput}
                autoFocus
                disabled={loginLoading}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
            {passwordError && <div className={styles.passwordError}>{passwordError}</div>}
            <button type="submit" className={styles.loginButton} disabled={loginLoading}>
              {loginLoading ? 'Текшерилүүдө...' : 'Кирүү'}
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

  if (loading || !data) {
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
        <p>Бул барак сизге гана көрүнөт.</p>
      </footer>
    </div>
  );
}