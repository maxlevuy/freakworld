import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";
import cartContext from "../../storage/CartContext";
import { createBuyOrderFSWithStock } from '../../services/firebase';
import BuyForm from '../BuyForm/BuyForm';
import Swal from 'sweetalert2';

function CartView() {
    const { cart, clearCart, removeItem, totalPrice } = useContext(cartContext);
    const navigate = useNavigate();

    function CreateBuyOrder(userData) {
        const buyData = {
            buyer: userData,
            items: cart,
            total: totalPrice(),
            date: new Date()
        }

        Swal.fire({
            title: 'Finalizando compra',
            text: 'Procesando transacción...',
            icon: 'info',
            timer: 4500,
            timerProgressBar: true,
            didOpen: () => Swal.showLoading()
        })
        
        createBuyOrderFSWithStock(buyData)
            .then(res => {
                clearCart();
                Swal.fire({
                    icon: 'success',
                    title: '¡Compra exitosa!',
                    text: `Tu compra fue confirmada. Tu ID es ${ res }.\n ¿Desea ir al detalle de su compra?`,
                    showConfirmButton: true,
                    confirmButtonText: 'Si, ir al detalle',
                    showCancelButton: true,
                    cancelButtonText: 'Seguir comprando'
                }).then(result => {
                    if (result.isConfirmed) {
                        navigate(`/checkout/${ res }`);
                    } else{
                        navigate(`/products`);
                    }
                })
            })
            .catch(e => {
                console.error(e);
                Swal.fire({
                    icon: 'error',
                    title: 'Error en la compra',
                    text: 'Algo sucedió durante la creación de tu orden de compra. Intente más tarde'
                })
            })
    }


    if (cart.length === 0) return <h1 className='text-center'>Tu carrito está vacío.</h1>

    return (
        <div className='container text-center mt-3'>
            <h1 className='fw-bold'>
                Tu carrito de compras
            </h1>
            <hr />

            <table className='table table-dark table-striped'>
                <thead>
                    <tr>
                        <th>Creador</th>
                        <th>Descripcion</th>
                        <th>Genero</th>
                        <th>Moneda</th>
                        <th>Cantidad</th>
                        <th>Precio Unitario</th>
                        <th>Precio Total</th>
                        <th>#</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.map((cartItem) => (
                        <tr key={cartItem.id}>
                            <td>
                                {cartItem.creator}
                            </td>
                            <td>
                                {cartItem.description}
                            </td>
                            <td>
                                {cartItem.gender}
                            </td>
                            <td>
                                Pesos uruguayos
                            </td>
                            <td>
                                {cartItem.quantity}
                            </td>
                            <td>
                                $ {cartItem.price}
                            </td>
                            <td>
                                $ {cartItem.quantity * cartItem.price}
                            </td>
                            <td>
                                <button onClick={() => removeItem(cartItem.id)} className='btn btn-outline-danger'>
                                    Remover item
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <br />
            <hr />
            <h4>Total a pagar:</h4>
            <h3>$ {totalPrice()}</h3>
            <br />

            {/* <button className='btn btn-success' onClick={() => CreateBuyOrder()}> Continuar </button> */}
            <Link to='/products'>
                <button className='btn btn-info'> Volver al catálogo </button>
            </Link>

            <button className='btn btn-warning' onClick={() => clearCart()}> Vaciar carrito </button>

            <BuyForm onSubmit={CreateBuyOrder} total={totalPrice()} />
        </div>
    )
}

export default CartView