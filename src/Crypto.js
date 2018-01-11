'use strict';

export default class Crypto {
  constructor(marketCurrency, baseCurrency, marketName, logoUrl = "", last, prevDay, volume, favourite = false) {
    this.marketCurrency = marketCurrency
    this.baseCurrency = baseCurrency
    this.marketName = marketName
    this.logoUrl = logoUrl
    this.last = last
    this.prevDay = prevDay
    this.volume = volume
    this.favourite = favourite
    this.cryptoUrl = `https://bittrex.com/Market/Index?MarketName=${marketName}`
  }

  updateStats(newLast, newPrevDay, newVolume) {
    this.last = newLast
    this.prevDay = newPrevDay
    this.volume = newVolume
  }
}
