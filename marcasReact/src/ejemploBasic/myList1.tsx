import './listaPituca.css'
function MyList1() {
    const lista = ["Rojo", "Azul", "Amarillo", "Negro"]

    return (
        <div>
            <hr />
            <p> Lista 1</p>
            <p> Recorremos la lista manualmente </p>
            
            <ul className="listaPituca">
                <li> {lista[0]}</li>
                <li> {lista[1]}</li>
                <li> {lista[2]}</li>
                <li> {lista[3]}</li>
            </ul>
        </div>
    )
}

export default MyList1