import React, { useState, useContext } from "react";
import ItemCount from "../ItemCount/ItemCount";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import cartContext from "../../storage/CartContext";

function ItemDetail( {product} ) {
    const [isInCart, setIsInCart] = useState(false);
    // const context = useContext(cartContext);
    const { cart, addToCart } = useContext(cartContext); // Destructuro para solo usar la funcion addToCart y la property cart
    
    let itemInCart = cart.find( item => product.id === item.id);
    let stock = product.stock;
    if (itemInCart) stock -= itemInCart.quantity;
    

    /**
     * @func onAddToCart Función que se ejecuta cuando se hace click en "Agregar al carrito" (parte del componente hijo)
     * @summary Llama y agrega al carrito del context, el product que sale de la db junto con la cantidad (count desde el hijo).
     * @param {number} count Parámetro que se recibe desde el hijo.
     * @member {Object} itemForCart Objeto que extiende el objeto "product", con el operador spread y agrega la property "quantity".
     */
    function onAddToCart(count) {
        setIsInCart(true);
        Swal.fire({
            title: 'Éxito',
            text: 'Se agregó el item al carrito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
        });

        /**
         * @summary Objeto especial que, a través del operador spread, recibe product y después le extiende quantity.
         * @member {*} product Producto que sale desde el componente padre, es decir, de las props (ver parámetro "product").
         * @member {number} quantity Variable que extiende a product, que correspone con el parámetro "count" que es enviado desde el evento click del compoente hijo.
         */
        const itemForCart = {
            ...product,
            quantity: count
        };
        
        addToCart(itemForCart);
    }

    return (
        <div className="w3-animate-opacity">
            <div className="card" style={{ width: "18rem" }}>
                <ul className="list-group list-group-flush">
                    <li className="list-group-item">
                        <img src={product.imgUrl} className="card-img-top" alt="imgProduct"></img>
                    </li>
                    <li className="list-group-item">
                        <div className="card-body">
                            <h5 className="card-title"> {product.description} </h5>
                            <p className="card-text">{product.creator}</p>
                            {product.gender}
                        </div>
                    </li>
                    <br />
                    <div className="text-center">
                        <h5>
                            Precio
                        </h5>
                        <small>Pesos uruguayos</small>
                    </div>
                    <br />
                    <li className="list-group-item">
                        <h5 className="priceTag">$ {product.price} </h5>
                    </li>
                    <li className="list-group-item">
                        <h5>En stock</h5>
                        {stock} unidades
                    </li>
                </ul>
                <div className="text-center m-3">
                    <p className="text-center fw-lighter fst-italic">
                        Categoría {product.category === "otaku" ? "Otaku" : "Friki"}
                    </p>
                </div>
            </div>
        { (stock === 0) ?
            ( <>Producto sin stock</> ) : (
                (!isInCart) ?
                    <ItemCount stock={stock} addToCart={onAddToCart} />
                :
                    <>
                        <Link to='/cart'>
                            <button className="btn btn-outline-success">Ir al carrito</button>
                        </Link>
                    </>
            )
        }

        </div>
    );
}

export default ItemDetail;
