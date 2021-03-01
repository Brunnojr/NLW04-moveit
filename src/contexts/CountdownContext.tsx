import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ChallengesContext } from "./ChallengesContext";

interface CountdownContextData {
    minutes: number;
    seconds: number;
    hasFinished: boolean;
    isActive: boolean;
    startCountDown: () => void;
    resetCountDown: () => void;
}

interface CountdownProviderProps {
    children: ReactNode;
}

export const CountdownContext = createContext({} as CountdownContextData)

let countDownTimeOut: NodeJS.Timeout;

export function CountdownProvider({children}: CountdownProviderProps) { // Childrem que vem de dentro das props

    const {startNewChallenge} = useContext(ChallengesContext); // estamos chamando o ChallengesContext aqui. Podendo pegar qualquer uma da propriedades ou funções que passamos nela.

    const [time, setTime] = useState(0.1 * 60); // controla o tempo (inicia 25:00)
    const [isActive, setIsActive] = useState(false); // aqui vamos conseguir controlar se a contagem está acontecendo ou não. Inicia como false, e muda para true quando clicar no botao.
    const [hasFinished, setHasFinished] = useState(false); // controla se finalizou a contagem.

    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    function startCountDown() {
        setIsActive(true);
    }

    function resetCountDown() {
        clearTimeout(countDownTimeOut); // Isso é JS. Apenas não deixa o timeout executar para não dar o delay.
        setIsActive(false);
        setHasFinished(false);
        setTime(0.1 * 60); // Volta o tempo para o valor inicial (25:00)
    }

    useEffect(()=> { // Efeito colateral. Executa sempre que isActive e/ou time mudar seu valor.
        if (isActive && time > 0) {
            countDownTimeOut = setTimeout(() => {
                setTime(time - 1);
            }, 1000);
        } else if (isActive && time === 0) {
            setHasFinished(true);
            setIsActive(false);
            startNewChallenge();
        }
    }, [isActive, time]) // tivemos que adicionar também o time, senão muda apenas uma vez.


    return (
        <CountdownContext.Provider value={{
            minutes,
            seconds,
            hasFinished,
            isActive,
            startCountDown,
            resetCountDown
        }}>  {/* precisamos passar o value com as informações que passaremos */}
            {children}
        </CountdownContext.Provider>
    )

}