import React from "react";
import "./product.css";
export const Product = ({
  imgSrc,
  description,
  price,
  buttonText,
  saleText,
}) => {
  return (
    <div className="product">
      <img src={imgSrc} />
      <p>{description}</p>
      <span>{price}</span>
      <button className="background">{buttonText}</button>
      <div className="sale">
        <p>{saleText}</p>
      </div>
    </div>
  );
};
