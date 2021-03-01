import Head from 'next/head';
import { GetServerSideProps } from 'next';


import { CompletedChallenges } from "../components/CompletedChallenges";
import { Countdown } from "../components/Countdown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import { ChallengeBox } from "../components/ChallengeBox";

import styles from "../styles/pages/Home.module.css";
import React from "react";
import { CountdownProvider } from "../contexts/CountdownContext";
import { ChallengesProvider } from '../contexts/ChallengesContext';

interface HomeProps {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
}

export default function Home(props: HomeProps) { // agora precisamos passar essas propriedades para o ChallengeContext
  console.log(props)
  return (
    <ChallengesProvider
      level={props.level}
      currentExperience={props.currentExperience}
      challengesCompleted={props.challengesCompleted}
    >
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>
        <ExperienceBar />

        <CountdownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallenges />
              <Countdown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountdownProvider>
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => { // Um dos motivos para a criação do next foi esse cara. Ele roda apenas no lado do servidor. Ex: Um console aqui não aparece no browse mas sim apenas no terminal.
  const { level, currentExperience, challengesCompleted } = ctx.req.cookies; // Aqui dentro temos todos os cookies de nossa app.

  return { // agora temos essas 3 informações para serem trabalhadas aqui dentro.
    props: {
      level: Number(level), // estamos transformando em numero pois elas estão sendo salvas como string nos cookies, lembra? 
      currentExperience: Number(currentExperience),
      challengesCompleted: Number(challengesCompleted)
    }
  }
}
