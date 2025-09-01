function ComponenteEventos2() {

  //Función flecha     parámetros (no tenemos ninguno)
  const manejarClick = () => {
    confirm("Hola ;) Buenas tardes");  //alert: aceptar    //confirm: aceptar - cancelar.
  };

  return (
    <button onDoubleClick={manejarClick}>
      Haz DOBLE clic aquí
    </button>
  );
}

export default ComponenteEventos2;