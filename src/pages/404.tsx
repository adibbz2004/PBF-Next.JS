import Head from 'next/head';
import Image from 'next/image';
import styles from '@/styles/404.module.scss';
import Link from 'next/link';

const Custom404 = () => {
    return (
        <div className={styles.error}>
            <Head>
                <title>404 | Halaman Tidak Ditemukan</title>
            </Head>

            <Image
                src="/page-not-found.png"
                alt="404 Not Found"
                width={400}
                height={200}
                className={styles.error__image}
            />

            <h1 className={styles.error__title}>404 - Halaman Tidak Ditemukan</h1>
            <p className={styles.error__description}>
                Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
            </p>
            <Link href="/" className={styles.error__button}>
                Kembali ke Beranda
            </Link>
        </div>
    );
};

export default Custom404;