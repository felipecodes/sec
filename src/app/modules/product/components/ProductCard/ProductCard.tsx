import React, { useState, useMemo } from 'react';
import Button from 'app/modules/shared/components/Button';
import Radio from 'app/modules/shared/components/Radio';
import Typography from 'app/modules/shared/components/Typography/Typography';
import Box from 'app/modules/shared/components/Box/Box';
import { CartStateDTO } from 'app/modules/cart/dto/CartDTO';
import { ProductStateDTO, PackState } from '../../dto/ProductDTO';
import * as styles from './ProductCard.styles';
import { mapToCartState } from '../../mappers/product.mapper';

const ProductCard: React.FC<{
  product: ProductStateDTO;
  addToCard(product: CartStateDTO): void;
  discountSelector(
    pack: PackState,
  ): {
    discount: string;
    unitaryPrice: string;
  };
}> = ({ product, addToCard, discountSelector }) => {
  const [firstPack] = product.packs;
  const [selectedPackId, setSelectedPackId] = useState(firstPack.id);

  const selectedPack = useMemo(() => {
    return product.packs.find(
      (pack) => pack.id === selectedPackId,
    ) as PackState;
  }, [selectedPackId]);

  const { discount, unitaryPrice } = useMemo(() => {
    return discountSelector(selectedPack);
  }, [selectedPack]);

  return (
    <styles.Card
      as={Box}
      borderRadius
      data-testid={`${product.uuid}-product-card`}
    >
      <styles.Image src={product.image} alt={product.description} />
      <styles.Name as={Typography} component="h2" variant="h3">
        {product.name}
      </styles.Name>
      <styles.Description as={Typography} color="secondary" variant="body">
        {product.description}
      </styles.Description>

      <styles.PackTitle as={Typography} component="h3" variant="h4">
        Escolha seu pack
      </styles.PackTitle>

      <styles.Packs>
        {product.packs.map((pack, index) => (
          <styles.Pack
            as={Radio}
            key={pack.id}
            name="pack"
            value={pack.id}
            label={`${pack.unities} unit.`}
            checked={pack.id === selectedPackId}
            onChange={(value) => setSelectedPackId(value)}
            data-testid={`${product.uuid}-product-pack-${index}`}
          />
        ))}
      </styles.Packs>

      <styles.Discount as={Box} padding="tight" borderRadius>
        <Typography fontWeight="bold">
          {discount}
          <br /> off
        </Typography>
      </styles.Discount>
      <styles.Price as={Typography} variant="body">
        De{' '}
        <Typography component="span" variant="body" fontWeight="bold">
          {selectedPack.originalPrice}
        </Typography>{' '}
        por{' '}
        <Typography component="span" variant="body" fontWeight="bold">
          {selectedPack.currentPrice}
        </Typography>
        <br />
        Unidade saí por:{' '}
        <Typography component="span" variant="body" fontWeight="bold">
          {unitaryPrice}
        </Typography>
      </styles.Price>

      <Button
        data-testid={`${product.uuid}-add-to-cart-button`}
        type="button"
        onClick={() => {
          addToCard(mapToCartState(product, selectedPackId));
        }}
      >
        Adicionar ao carrinho
      </Button>
    </styles.Card>
  );
};

export default ProductCard;
