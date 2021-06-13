let calculateDiscount = (ad) => {
  if (ad.discountType == 'percentage') ad.newPrice = (ad.price - (ad.price / 100) * ad.discount)
  else if (ad.discountType == 'fixed') ad.newPrice = ad.price - ad.discount
  else return ad
}

module.exports = { calculatePriceWithDiscount }