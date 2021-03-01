import { createContext, ReactNode, useEffect, useState } from 'react'
import challenges from '../../challenges.json';
import Cookies from 'js-cookie';
import { LevelUpModal } from '../components/LevelUpModal';


interface challenge {
    type: 'eye' | 'body';
    description: string;
    amount: number;
}

interface ChallengesProviderProps { //tipagem do children
    children: ReactNode // tipo reactNode aceita qualquer coisa como filho (componente, texto, tag html). Neste caso estamos passando uma tag
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

interface ChallengeContextData { // Tipagem dos dados que vou retornar do contexto lá embaixo no value.
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    levelUp: () => void; // função que não recebe parametro e não tem retorno
    startNewChallenge: () => void; // função que não recebe parametro e não tem retorno
    activeChallenge: challenge;
    resetChallenge: () => void;
    experienceToNextLevel: number;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext({} as ChallengeContextData); // estamos tipando o challengesContext

export function ChallengesProvider({
    children, 
    ...rest // Esse cara tá salvando todas as propriedades presentes no provider que não são a children (level, challengeExperience, challengesCompleted)
} :ChallengesProviderProps) { // desestruturamos a props e pegamos apenas a children da mesma 
    const [level, setLevel] = useState(rest.level ?? 1); //O valor inicial será rest.level (que vem dos cookies) e se isso não existir, será 1.
    const [currentExperience, setCurrentExperience] = useState(rest.currentExperience ?? 0); // experiencia do usuário que sempre iniciará em 0.
    const [challengesCompleted, setChallengesCompleted] = useState( rest.challengesCompleted ?? 0); // O tanto de desadiors que esse usuário já completou
    // vamos retornar essas informações todas no nosso value ali embaixo.

    const [activeChallenge, setActiveChallenge] = useState(null); // var criada para armazenar o desafio atual sorteado
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2) // variavel que vai calcular a experiencia que o usuario precisa para ir ao proximo level, baseado em seu level atual.

    useEffect(() => {
        Notification.requestPermission(); // Usando a proprioa API do browser, Aqui estamos pedindo permissão ao browser para disparar notificações
    }, []) // ao passar um array vazio assim, o useEffect dispara a função desejada uma unica vez (quanto a tela for carregada).

    useEffect(() => {
        Cookies.set('level', String(level)); // como o cookie só aceita texto, estamos transformando o numero (level) em string
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted])

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal() {
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length) // sorteia um desafio aleatório do json de desafios.
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if(Notification.permission === 'granted'){
            new Notification('Novo desafio ', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() { // função que será chamada no click do botao falhei.
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if(!completeChallenge){
            return; // isso aqui é como se fosse um void (retorno vazio).
        }

        const {amount} = activeChallenge // estamos desestruturando a propriedade amount do activeChallenge(challenge)
    
        let finalExperience = currentExperience + amount; // xp do usuário + a qtd de xp do desafio = experiencia final.
    
        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
            // upa o nivel do usuário e o deixa com o resto da subtração de xp.
        }

        setCurrentExperience(finalExperience); //atribui a experiencia atual para a variavel currentExperience
        setActiveChallenge(null); // zera o desafio pois o mesmo foi concluído
        setChallengesCompleted(challengesCompleted + 1) // componente desafios completos.
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level, 
                currentExperience, 
                challengesCompleted, 
                activeChallenge,
                experienceToNextLevel,
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal
            }}>
            {children} {/*  temos que passar o childrem pois lá na app ele recebe conteúdo dentro  */}
            { isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    )
}