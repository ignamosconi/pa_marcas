import { useEffect, useState } from "react";

function UseEffect3() {
  const [tarjeta, setTarjeta] = useState("Lopez Pedro");
  const [contador, setContador] = useState(0);

  const handleTarjeta = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta(event.target.value);
  };

  const handleContador = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setContador(contador + 1);
  };



  /**
   * El mismo concepto de `useEffect` original, solo que envolvemos sus dependencias
   * en un `Array` al final de la funcion.
   *
   * Cada vez que uno de los valores de las dependencias cambie, se ejecutara la funcion del `useEffect`.
   * En este caso, cada vez que cambie el estado de `tarjeta` se ejecutara el `console.log`.
   *
   * IMPORTANTE: La dependencia debe tener estado, si es una constante o un valor fijo, no es una dependencia.
   */

  //Array de dependencias vacío: La función se ejecuta sólamente al montar el componente
  useEffect(() => {
    console.log("useEffect 3 - ");
  }, []);

  //Este array de dependencias indica que el useEffect sólo va a dispararse cuando "tarjeta" cambie.
  useEffect(() => {
    console.log("useEffect 3 - Escribiste en la tarjeta.");
  }, [tarjeta]);

  //Este array de dependencias indica que el useEffect sólo va a dispararse cuando "contador" cambie.
  useEffect(() => {
    console.log("useEffect 3 - Tocaste el botón del contador.");
  }, [contador]);

  return (
    <div>
      <div>
        <h2> Use Effect 3 - 2 funciones useEffect(), con un array de dependencia c/u </h2>
        <form>
          <p> Tarjeta: <strong> {tarjeta} </strong> </p>

          <input
            type="text"
            onChange={handleTarjeta}
            placeholder="Ingrese los datos"
          />

          <p>El contador está en: {contador}</p>
          <button onClick={handleContador}> Click </button>
        </form>
      </div>
    </div>
  );
}

export default UseEffect3;