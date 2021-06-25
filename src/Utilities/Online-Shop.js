let calculateDiscount = (product) => {
  if (product.discountType == 'percentage') product.newPrice = (product.price - (product.price / 100) * product.discount)
  else if (product.discountType == 'fixed') product.newPrice = product.price - product.discount
  else return product
}

module.exports = { calculatePriceWithDiscount }