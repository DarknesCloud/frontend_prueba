import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: {
    rate: number;
    count: number;
  };
}

const ProductCard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get('https://fakestoreapi.com/products')
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Error al cargar los productos');
        setLoading(false);
      });
  }, []);

  return (
    <Grid container spacing={2} style={{ margin: '50px', marginTop: '80px' }}>
      {loading ? (
        <Typography variant="h6">Cargando...</Typography>
      ) : error ? (
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      ) : (
        products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={product.id}>
            <Card style={{ height: '100%' }} className="cardsContainer">
              <CardMedia
                component="img"
                alt={product.title}
                height="200"
                image={product.image}
                title={product.title}
              />
              <CardContent>
                <Typography variant="subtitle2" component="div">
                  {product.title}
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  $ <span style={{ color: 'green' }}>{product.price}</span>
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <StarIcon
                      key={i}
                      style={{
                        color: i < product.rating.rate ? 'gold' : 'gray',
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  <IconButton aria-label="Agregar al carrito" size="small">
                    <AddShoppingCartIcon />
                  </IconButton>
                  <IconButton
                    aria-label="Agregar a la lista de deseos"
                    size="small"
                  >
                    <FavoriteIcon />
                  </IconButton>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))
      )}
    </Grid>
  );
};

export default ProductCard;
