import { useState } from "react";
import './State1.css'

function State1_1() {

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

  //Definimos el useState del contador
  const [contador, setContador] = useState(0); 

  //Definimos el useState del limInferior
  const [limInferior, setLimInf] = useState(-5)

  //Definimos el useState del limSuperior
  const [limSuperior, setLimSup] = useState(5)

  /* 
    Queremos chequear no pasarnos de los límites, por lo que quedaría más engorroso si usamos funciones
    flecha anónimas en el HTML. En su lugar, hacemos funciones flecha nombradas y después instanciamos.
  */
  const aumentarCont = () => {
    if ( (contador < limSuperior) && (contador >= limInferior) ) {
      setContador(contador + 1)
    }
  }

  const disminuirCont = () => {
    if ( (contador <= limSuperior) && (contador > limInferior) ) {
      setContador(contador - 1)
    }
  }

  const exponencialCont = () => {
    if ( (contador <= limSuperior) && (contador >= limInferior) && (contador**2 < limSuperior)) {
      setContador(contador**2)
    }
  }

  const randomContador = () => {
    const min = limInferior
    const max = limSuperior
    setContador(Math.floor(Math.random() * (max - min + 1)) + min)
  }

  /*
    Controles para que los límites no se "pisen" entre ellos (que el inferior siempre sea más chico)
  */
    const aumentarLimInferior = () => {
      if (limInferior < limSuperior) {
          setLimInf(limInferior + 1)
      }
    }

    const disminuirLimSuperior = () => {
      if (limSuperior > limInferior) {
        setLimSup(limSuperior - 1)
      }
    }



  //En State1.1 vamos a utilizar funciones de flecha NOMBRADAS para añadir validaciones
  return (
    <div className="container">
      <hr/>
      <h2>State 1.1</h2>
      <br />
      <div>
        <p> <b>Límite inferior</b>: {limInferior} </p>
        <button className="button" onClick={() => setLimInf(limInferior - 1)}> -1 </button>
        <button className="button" onClick={aumentarLimInferior}> +1 </button>
      </div>
      
      <div>
        <p> <b>Límite superior</b>: {limSuperior} </p>
        <button className="button" onClick={disminuirLimSuperior}> -1 </button>
        <button className="button" onClick={() => setLimSup(limSuperior + 1)}> +1 </button>
      </div>

    
      <p className="contador-text">VALOR DEL CONTADOR: {contador} </p>
      <button className="button" onClick={aumentarCont}> Incrementar </button>
      <button className="button" onClick={disminuirCont}> Disminuir </button>
      <button className="button" onClick={exponencialCont}> Exponencial </button>
      <button className="button" onClick={randomContador}> Random </button>
      <button className="button" onClick={() => setContador(0)}>Reiniciar</button>
    </div>
  );
}

export default State1_1;