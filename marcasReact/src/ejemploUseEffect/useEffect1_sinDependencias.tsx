import { useEffect, useState } from "react";
/*
  useEffect() se ejecutará después de cada render. 
*/
function UseEffect1() {
  const [tarjeta, setTarjeta] = useState("Sample text");


  const handleTarjeta = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta(event.target.value);
  };

  /*
    useEffect():
    Este hook se ejecuta después de que el componente (en este caso, UseEffect1) se renderiza.
      • Si NO se le pasa un array de dependencias (como acá) se ejecutará después de CADA render.
      • Si se le pasa un array vacío [], se ejecuta solo una vez al montar el componente.
      • Si se le pasa un array con dependencias, se ejecuta solo cuando alguna de ellas cambia.

    La función useEffect() toma de parámetro una función flecha (anónima o declarada). En este ejemplo, 
    como no hay array de dependencias, la función useEffect() va a ejecutarse cuando:
      • El componente se renderiza por primera vez (esto recibe el nombre de montaje).
      • Cada vez que cambia el estado de useEffect1() con onChange={handleTarjeta}, tendrá que 
        renderizarse de nuevo. Junto con este renderizado, va a ejecutarse la función useEffect().
  */
  useEffect(() => {
    console.log("useEffect 1 - Sin dependencias.");
  });

  return (
    <div>
      <h2> Use Effect 1 - Sin dependencias</h2>
         <p> Tarjeta: <strong> {tarjeta} </strong> </p>

        <input
          type="text"
          onChange={handleTarjeta}
          placeholder="Ingrese los datos"
        />
    </div>
  );
}

export default UseEffect1;