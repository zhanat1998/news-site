'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.scss';

interface DailyData {
  date: string;
  postViews: number;
  bannerViews: number;
  bannerClicks: number;
}

interface PostStats {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  category: string;
  views: number;
}

interface AdvertiserStats {
  advertiser: string;
  views: number;
  clicks: number;
}

interface AnalyticsData {
  period: string;
  totalPostViews: number;
  totalBannerViews: number;
  totalBannerClicks: number;
  dailyStats: DailyData[];
  topPosts: PostStats[];
  advertiserStats: AdvertiserStats[];
}

// SVG Line Chart
function LineChart({ data, lines }: {
  data: DailyData[];
  lines: { key: keyof DailyData; color: string; label: string }[];
}) {
  const W = 900, H = 220, PL = 55, PR = 20, PT = 20, PB = 40;
  const chartW = W - PL - PR;
  const chartH = H - PT - PB;

  if (!data.length) return <div className={styles.chartEmpty}>Маалымат жок</div>;

  const allValues = lines.flatMap(l => data.map(d => d[l.key] as number));
  const maxVal = Math.max(...allValues, 1);

  const xStep = chartW / Math.max(data.length - 1, 1);

  const toPath = (key: keyof DailyData) =>
    data.map((d, i) => {
      const x = PL + i * xStep;
      const y = PT + chartH - ((d[key] as number) / maxVal) * chartH;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }).join(' ');

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    val: Math.round(maxVal * t),
    y: PT + chartH - t * chartH,
  }));

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}к` : String(n);
  const fmtDate = (s: string) => {
    const d = new Date(s);
    return `${d.getDate()} ${d.toLocaleString('ru', { month: 'short' })}`;
  };

  const showEvery = Math.ceil(data.length / 8);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={styles.svg}>
      {/* Grid */}
      {yTicks.map(t => (
        <g key={t.y}>
          <line x1={PL} y1={t.y} x2={W - PR} y2={t.y} stroke="#e5e7eb" strokeDasharray="4 2" />
          <text x={PL - 6} y={t.y + 4} textAnchor="end" fontSize={11} fill="#9ca3af">{fmt(t.val)}</text>
        </g>
      ))}
      {/* Lines */}
      {lines.map(l => (
        <path key={l.key as string} d={toPath(l.key)} fill="none" stroke={l.color} strokeWidth={2} strokeLinejoin="round" />
      ))}
      {/* X labels */}
      {data.map((d, i) => i % showEvery === 0 && (
        <text key={d.date} x={PL + i * xStep} y={H - 8} textAnchor="middle" fontSize={11} fill="#9ca3af">
          {fmtDate(d.date)}
        </text>
      ))}
    </svg>
  );
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState('week');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/analytics?period=${period}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [period]);

  const fmtDate = (s: string) => {
    if (!s) return '—';
    return new Date(s).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logo}>Сокол.Медиа</div>
        <h1 className={styles.title}>Аналитика</h1>
        <div className={styles.periods}>
          {[['today', 'Бүгүн'], ['week', 'Жума'], ['month', 'Ай']].map(([val, label]) => (
            <button
              key={val}
              className={`${styles.periodBtn} ${period === val ? styles.active : ''}`}
              onClick={() => setPeriod(val)}
            >{label}</button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Жүктөлүүдө...</div>
      ) : !data ? (
        <div className={styles.error}>Маалымат жүктөлгөн жок</div>
      ) : (
        <>
          {/* Metrics */}
          <div className={styles.metrics}>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Пост көрүүлөр</div>
              <div className={styles.metricValue}>{(data.totalPostViews || 0).toLocaleString('ru')}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Рекламные показы</div>
              <div className={styles.metricValue}>{(data.totalBannerViews || 0).toLocaleString('ru')}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>Клики по баннерам</div>
              <div className={styles.metricValue}>{(data.totalBannerClicks || 0).toLocaleString('ru')}</div>
            </div>
            <div className={styles.metric}>
              <div className={styles.metricLabel}>CTR</div>
              <div className={styles.metricValue}>
                {data.totalBannerViews > 0
                  ? `${((data.totalBannerClicks / data.totalBannerViews) * 100).toFixed(2)}%`
                  : '0%'}
              </div>
            </div>
          </div>

          {/* Post views chart */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>ДИНАМИКА ПРОСМОТРОВ ПОСТОВ</div>
            <div className={styles.legend}>
              <span><span className={styles.dot} style={{ background: '#3b82f6' }} />пост_просмотры</span>
            </div>
            <LineChart
              data={data.dailyStats}
              lines={[{ key: 'postViews', color: '#3b82f6', label: 'Посттор' }]}
            />
          </div>

          {/* Banner chart */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>ДИНАМИКА ПОКАЗОВ И КЛИКОВ ПО БАННЕРАМ</div>
            <div className={styles.legend}>
              <span><span className={styles.dot} style={{ background: '#06b6d4' }} />баннер_показы</span>
              <span><span className={styles.dot} style={{ background: '#f59e0b' }} />баннер_клики</span>
            </div>
            <LineChart
              data={data.dailyStats}
              lines={[
                { key: 'bannerViews', color: '#06b6d4', label: 'Показы' },
                { key: 'bannerClicks', color: '#f59e0b', label: 'Клики' },
              ]}
            />
          </div>

          {/* Advertiser stats */}
          {data.advertiserStats.length > 0 && (
            <div className={styles.card}>
              <div className={styles.cardHeader}>РЕКЛАМОДАТЕЛИ</div>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Рекламодатель</th>
                    <th>Показы</th>
                    <th>Клики</th>
                    <th>CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {data.advertiserStats.map(a => (
                    <tr key={a.advertiser}>
                      <td>{a.advertiser}</td>
                      <td>{(a.views || 0).toLocaleString('ru')}</td>
                      <td>{(a.clicks || 0).toLocaleString('ru')}</td>
                      <td>{a.views > 0 ? `${((a.clicks / a.views) * 100).toFixed(2)}%` : '0%'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Top posts */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>ЭҢ ПОПУЛЯРДУУ ПОСТТОР</div>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Аталышы</th>
                  <th>Категория</th>
                  <th>Дата</th>
                  <th>Көрүүлөр</th>
                </tr>
              </thead>
              <tbody>
                {data.topPosts.map((p, i) => (
                  <tr key={p._id}>
                    <td className={styles.rank}>{i + 1}</td>
                    <td>
                      <a
                        href={`/news/${p.publishedAt?.split('T')[0]}/${p.slug?.current}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.postLink}
                      >
                        {p.title}
                      </a>
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>{fmtDate(p.publishedAt)}</td>
                    <td className={styles.views}>{(p.views || 0).toLocaleString('ru')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
