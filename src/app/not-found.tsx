import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        padding: '60px 40px',
        maxWidth: '500px',
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      }}>
        <h1 style={{
          fontSize: 'clamp(80px, 15vw, 140px)',
          fontWeight: '800',
          color: '#0033a0',
          margin: '0',
          lineHeight: '1',
        }}>
          404
        </h1>
        <h2 style={{
          fontSize: 'clamp(18px, 4vw, 24px)',
          fontWeight: '600',
          color: '#1a1a1a',
          margin: '20px 0 12px',
        }}>
          Бет табылган жок
        </h2>
        <p style={{
          fontSize: 'clamp(14px, 3vw, 16px)',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6',
        }}>
          Сиз издеген бет жок же башка дарекке көчүрүлгөн болушу мүмкүн.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 40px',
            backgroundColor: '#0033a0',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(0, 51, 160, 0.3)',
            transition: 'all 0.2s ease',
          }}
        >
          Башкы бетке кайтуу
        </Link>
      </div>
    </div>
  );
}