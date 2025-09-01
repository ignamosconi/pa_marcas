import { useState } from "react";
import './State1.css'

function State1() {

  /*
    ¿QUÉ ES? - useState()
    La función useState() permite crear y manejar estados dentro de una función (en este caso, State1() ).
    El argumento que le pasamos es el VALOR INICIAL que toma el estado (0, en este caso).

    Al ejecutar useState(0) se devuelve un array de dos elementos. 
    • En el índice 0, se encuentra el valor actual del estado, que como vimos antes, va a iniciarse en 0.
    • Una función, cuyo nombre y definición declaramos  nosotros, para actualizar el valor de ese estado.

    La función puede ser una que controle una máquina de estados. Recibimos un input externo, y en base
    al valor actual del estado, definiremos el siguiente estado.
  */


  /* 
    INICIO DEL STATE: Iniciamos el estado con valor 0 (por lo que se infiere el tipo 'number' al estado)
    
    Esto es equivalente a hacer:
      auxiliar = useState(0)
      contador = auxiliar[0]
      setContador = auxiliar[1]
    
    Más info sobre desestructuración: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  */

  const [contador, setContador] = useState(0); 

  /* 
    setContador: ya sabe que va a trabajar con valores numéricos enteros, por lo que solo tenemos que
    pasarle un nuevo número para que cambie su "estado" a este.


    onClick: Esta función espera recibir una función, no el resultado de una función (por eso no escribimos
    onClick = {setContador(contador+1)}).

    Debemos entonces pasar una función flecha ANÓNIMA. 
    La sintaxis de una función flecha NOMBRADA: 
      const auto = () => { ... }
        • auto: Nombre de la función.
        • (): Parámetros de la función.
        • => { }: Introducimos el contenido de la función. 

    En onClick podemos invocar la ejecución de una función flecha nombrada, con onClick={auto}, pero esto
    separa mucho el código y lo hace difícil de leer. 
    La solución es utilizar una función flecha ANÓNIMA directamente en onClick, usando onClick={() => {...}} 
  */

  //En State1.1 vamos a utilizar funciones de flecha NOMBRADAS para añadir validaciones
  return (
    <div className="container">
      <hr/>
      <h2>State 1</h2>
      <p className="contador-text">VALOR DEL CONTADOR: {contador} </p>
      <button className="button" onClick={() => {setContador(contador + 1)} }> Incrementar </button>
      <button className="button" onClick={() => {setContador(contador - 1)} }> Disminuir </button>
      <button className="button" onClick={() => {setContador(contador**2)} }> Exponencial </button>
      <button className="button" onClick={() => setContador(0)}>Reiniciar</button>
    </div>
  );
}

export default State1;