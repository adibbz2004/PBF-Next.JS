import styles from './navbar.module.css';
import Script from 'next/dist/client/script';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

const Navbar = () => {
  const {data}:any = useSession()
  //const { data: session } = useSession()
  // console.log("session", session)
  return (
    <div className={styles.navbar} data-testid="navbar">
      {/* <div className={styles.navbar__brand}>
        MyApp
      </div> */}

      <div className={styles.navbar__brand} id="title" data-testid="navbar-brand"></div>
      <Script id="title-script" strategy='lazyOnload' >
        {`document.getElementById('title').innerHTML = 'MyApp';`}
      </Script>

      <div className={styles.navbar__right}>
        {data ? (
          <>
            <div className={styles.navbar__user}>
              {data.user?.image && (
                <Image 
                  src={data.user.image}
                  alt={data.user.fullname} 
                  width={50}
                  height={50}
                  className={styles.navbar__user__image}
                />
              )}
              Welcome, {data.user?.fullname}
            </div>
            <button
              className={`${styles.navbar__button} ${styles["navbar__button--danger"]}`}
              onClick={() => signOut()}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            className={`${styles.navbar__button} ${styles["navbar__button--primary"]}`}
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
