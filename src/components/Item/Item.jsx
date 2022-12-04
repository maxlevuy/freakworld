import React, { useState, /*useEffect*/ } from "react";
import { Link } from "react-router-dom";
import "./item.css";

function Item(props) {
  const [isFavorite, setIsFavorite] = useState(false);

  let classButtonFavorite = isFavorite === true ? "card-favicon favorite" : "card-favicon";

  let urlDetail = `/products/detail/${props.product.id}`;

  function handleFavorite() {
    setIsFavorite(!isFavorite);
  }

  return (
    <div className="card text-center">
      <button onClick={handleFavorite} className={classButtonFavorite}>
        Agregar a favoritos
      </button>
      <div className="card-img">
        <img src={props.product.imgUrl} alt="Product img" />
      </div>
      <div className="card-detail">
        <h3>{props.product.description}</h3>
        <p>{props.product.creator}</p>
        <h4 className="priceTag">$ {props.product.price}</h4>
        <small>Pesos uruguayos</small>
      </div>
      <Link to={urlDetail}>
        <button className="btn btn-outline-info">Ver más</button>
      </Link>
      <br />
      <div className="card-footer text-center">
        <p className="text-center fw-lighter fst-italic">
          Categoría {props.product.category === "otaku" ? "Otaku" : "Friki"}
        </p>
      </div>
    </div>
  );
}

export default Item;