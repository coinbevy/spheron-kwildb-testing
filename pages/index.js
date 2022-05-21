import { useState } from "react";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home(props) {
  const [isLoading, setIsLoading] = useState(false);
  const [txtAddData, setTxtAddData] = useState("");
  const [txtDeleteData, setTxtDeleteData] = useState("");
  const onClickAddData = async () => {
    if (txtAddData.trim().length === 0) return alert("Enter text to add.");
  };
  const onClickDeleteData = async () => {
    if (txtDeleteData.trim().length === 0) return alert("Enter text to add.");
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Spheron, KwilDB, and NextJS Testing</title>
        <meta name="description" content="Spheron, KwilDB, and NextJS Testing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Spheron, KwilDB, and NextJS Testing
        </h1>
        
        {isLoading && <div><h4>Loading...</h4></div>}
        {props && props.usernames && <p>Found Data: {props.usernames}</p>}

        <div className={styles.grid}>
          <div className={styles.card}>
            <h2>Add Data &rarr;</h2>
            <p>
              <input type="text" id="txtAddData" value={txtAddData} onChange={e => setTxtAddData(e.target.value)} />
              <button type="button" id="btnAddData" onClick={onClickAddData}>Submit</button>
            </p>
          </div>

          <div className={styles.card}>
            <h2>Delete Data &rarr;</h2>
            <p>
              <input type="text" id="txtDeleteData" value={txtDeleteData} onChange={e => setTxtDeleteData(e.target.value)} />
              <button type="button" id="btnDeleteData" onClick={onClickDeleteData}>Submit</button>
            </p>
          </div>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://coinbevy.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Testing by{' '}CoinBevy
        </a>
      </footer>
    </div>
  )
}

export async function getStaticProps() {
  const KwilDB = require("kwildb");
  const privKey = typeof process.env.KWILDB_PRIV_KEY === 'string' ? JSON.parse(process.env.KWILDB_PRIV_KEY) : process.env.KWILDB_PRIV_KEY;
  const scrtLey = process.env.KWILDB_SCRT_KEY;
  const moatParams = {
    host: 'test-db.kwil.xyz',
    protocol: 'https',
    moat: 'coinbevy',
    privateKey: privKey
  }
  const myMoat = KwilDB.createConnector(moatParams, scrtLey);
  // await myMoat.query(`CREATE TABLE public.usernames(username VARCHAR(100) PRIMARY KEY, wallet_address VARCHAR(43) NOT NULL)`, true);
  // await myMoat.query(`INSERT INTO public.usernames (username, wallet_address) VALUES ('coinbevy', 'Cf1cXx1wENt0XOA9wMoTWYB-rvP0jEdGS1gdQN7XkvQ')`, true);
  const usernames = await myMoat.query(`SELECT * FROM public.usernames;`);
  console.log("Fetched usernames", usernames, typeof usernames, usernames && usernames.rows && usernames.rows.map((row) => row.username).join(", "));
  return {
    props: {usernames: usernames && usernames.rows && usernames.rows.map((row) => row.username).join(", ")}
  };
}