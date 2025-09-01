import { useEffect, useState } from "react";
/*
  useEffect() se ejecutará sólo al montar el componente

  NOTA: Al usar React en MODO DESARROLLO  y tenés envuelto tu app en <React.StrictMode>, React
  intencionalmente monta, desmonta y vuelve a montar componentes para detectar efectos secundarios 
  no deseados o código inseguro. 
  
  Es decir, sólo en modo desarrollo (en producción NO) el componente se monta dos veces, por lo que 
  a pesar de que pasamos un array vacío, vamos a ver dos console logs.
*/
function UseEffect1_1() {
  const [tarjeta, setTarjeta] = useState("Sample text");


  const handleTarjeta = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta(event.target.value);
  };

  //Pasamos un array vacío como dependencia, por lo que la función useEffect() sólo va a ejecutarse
  //cuando se monte el componente. Como se mencionó al principio, va a ejecutarse dos veces en dev mode.
  useEffect(() => {
    console.log("useEffect 1.1 - Array de dependencias vacío.");
  }, []);

  return (
    <div>
      <h2> Use Effect 1.1 - Array de dependencias vacío</h2>
         <p> Tarjeta: <strong> {tarjeta} </strong> </p>

        <input
          type="text"
          onChange={handleTarjeta}
          placeholder="Ingrese los datos"
        />
    </div>
  );
}

export default UseEffect1_1;