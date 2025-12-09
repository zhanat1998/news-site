import Link from 'next/link';
import styles from './SectionHeader.module.scss';

type Props = {
  title: string;
  link?: string;
};

export default function SectionHeader({ title, link }: Props) {
  return (
    <div className={styles.header}>
      <h3 className={styles.title}>{title}</h3>
      {link && (
        <Link href={link} className={styles.more}>
          →
        </Link>
      )}
    </div>
  );
}