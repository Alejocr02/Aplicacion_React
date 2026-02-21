
import { useState } from 'react';

import styles from './ProductCard.module.css';

function ProductCard({ name, category, price, image, description }) {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);


        const handleLike = () => {
            if (isLiked) {
                setLikes(likes - 1);
            } else {
                setLikes(likes + 1);
                setIsLiked(true);
            }
        }
    return (
        <article className={styles.productCard}>
        <img src={image || null} alt={name} className={styles.productImage} />
        <div className={styles.productInfo}>
           <span className={styles.productCategory}>{category}</span>
           <h3 className={styles.productName}>{name}</h3>
           <p className={styles.productDescription}>{description}</p>
           <div className={styles.productFooter}>
                <span className={styles.productPrice}>${price}</span>
                <button 
                className={`${styles.btnLike} ${isLiked ? styles.Liked : ''}`}
                onClick={handleLike}
                >
                {isLiked ? 'Liked' : 'Like'} {likes} Me gusta
                </button>
           </div>
        </div>
        </article>
    );
}

export default ProductCard;