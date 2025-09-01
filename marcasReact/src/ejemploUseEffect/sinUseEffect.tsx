import { useState } from "react";


/*
    En este código mostramos como veníamos trabajando en la carpeta useState. Nada nuevo.
*/
function SinUseEffect() {
    
  const [tarjeta, setTarjeta] = useState("Lopez Pedro");

  const handleTarjeta = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTarjeta(event.target.value);
  };

  return (
    <div>
      <h2> Sin Use Effect</h2>
        <p> Tarjeta: <strong> {tarjeta} </strong> </p>

        <input
          type="text"
          onChange={handleTarjeta}
          placeholder="Ingrese los datos"
        />
    </div>
  );
}

export default SinUseEffect;