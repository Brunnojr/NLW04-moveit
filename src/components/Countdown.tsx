import { useContext } from 'react';
import { CountdownContext } from '../contexts/CountdownContext';
import styles from '../styles/components/Countdown.module.css';

export function Countdown() {
    const { 
        minutes, 
        seconds, 
        hasFinished, 
        isActive, 
        startCountDown, 
        resetCountDown 
    } = useContext(CountdownContext);

    // o codigo abaixo está aqui e não no context pois é uma formatação de dado. Ou seja, não é uma regra de negócio, mas sim parte do layout.
    const [minuteLeft, minuteRight] = String(minutes).padStart(2, '0').split('') // o codigo faz o seguinte: se o numero de minutos for menor que 10, possuindo apenas 1 casa, vai adicionar o 0 a esquerda. Senão pula direto para o split, que vai separar os dois numeros para conseguirmos usa-los em lugares diferentes.
    const [secondeLeft, secondRight] = String(seconds).padStart(2, '0').split('') // fazemos o mesmo com os segundos.

    return(
        <div>
            <div className={styles.countdownContainer}>
                <div>
                    <span>{minuteLeft}</span>
                    <span>{minuteRight}</span>
                </div>
                <span>:</span>
                <div>
                    <span>{secondeLeft}</span>
                    <span>{secondRight}</span>
                </div>
            </div>

            {hasFinished ? (
                <button 
                disabled
                className={styles.countdownButton}
                >
                Ciclo encerrado
                </button>
            ) : (
                <> {/* isso se chama fragment. É como se fosse uma div, mas não é exibida. Serve apenas para não dar erro. */}
                { isActive ? (
                    <button 
                    type="button" 
                    className={`${styles.countdownButton} ${styles.countdownButtonActive}`}
                    onClick={resetCountDown}
                    >
                        Abandonar ciclo
                    </button>
                ) : (
                    <button 
                    type="button" 
                    className={styles.countdownButton}
                    onClick={startCountDown}
                    >
                        Iniciar um ciclo
                    </button>
                ) }
                </>
            )}
            
        </div>
    )
}