import { useEffect, useState } from "react";

/*
  Conceptualmente esto es un useState sin dependencias, por lo que cada vez que se vuelva a renderizar
  el componente (ya sea a través de un cambio de estado disparado por la tarjeta o el contador); va
  a ejecutarse useEffect.
*/

function UseEffect2() {

  const [tarjeta, setTarjeta] = useState("Lopez Pedro");
  const [contador, setContador] = useState(0);

  const handleTarjeta = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta(event.target.value);
  };

  const handleContador = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setContador(contador + 1);
  };

  useEffect(() => {
    console.log("useEffect 2 - Sin Dependencias: No puede distinguirse entre tarjeta / contador.");
  });

  return (
    <div>
      <div>
        <h2> Use Effect 2 - Sin Dependencias </h2>
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

export default UseEffect2;