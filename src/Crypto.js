'use strict';

export default class Crtypto {
  constructor(marketCurrency, baseCurrency, marketName, logoUrl, last, prevDay, volume) {
    this.marketCurrency = marketCurrency
    this.baseCurrency = baseCurrency
    this.marketName = marketName
    this.logoUrl = logoUrl
    this.last = last
    this.prevDay = prevDay
    this.volume = volume
    this.cryptoUrl = `https://bittrex.com/Market/Index?MarketName=${marketName}`
  }
}
