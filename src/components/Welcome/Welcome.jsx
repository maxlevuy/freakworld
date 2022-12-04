import React from 'react'
import { Link } from 'react-router-dom'

function Welcome() {
    return (
        <div className='m-2 text-center'>
            <h2>
                ¡Bienvenidos a la tienda n°1 del condado!
            </h2>

            <p>
                Puede dirigirse al catálogo haciendo click <Link to={'/products'}>aquí</Link>, o bien puede navegar desde el panel principal.
            </p>
        </div>
    )
}

export default Welcome