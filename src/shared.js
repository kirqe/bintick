// computed

export function holdings() {
  if (_.has(this.crypto.portfolio, "holdings")) {
    if (this.crypto.portfolio.holdings == 0) {
      return 0
    }
    return this.crypto.portfolio.holdings
  }
}

export function holdingsValue() {
  if (_.has(this.crypto.portfolio, "holdings")) {
    if (this.crypto.portfolio.holdings == 0) {
      return 0
    }
    return (this.crypto.portfolio.holdings * this.calculatedPrice).toFixed(4)
  }
}

export function calculatedPrice(){
  var price = 0
  if (this.crypto.symbol.endsWith("BTC")) {
    price = this.crypto.lastPrice * this.rates[this.currency]["last"]
  }
  if (this.crypto.symbol.endsWith("ETH")) {
    price = this.crypto_rates.ethbtc.lastPrice *
            this.crypto.lastPrice *
            this.rates[this.currency]["last"]
  }
  if (this.crypto.symbol.endsWith("USDT")) {
    price = (this.crypto.lastPrice / this.crypto_rates.usdtbtc.lastPrice) *
            this.rates[this.currency]["last"]
  }
  if (this.crypto.symbol.endsWith("BNB")) {
    price = this.crypto_rates.bnbbtc.lastPrice *
            this.crypto.lastPrice *
            this.rates[this.currency]["last"]
  }

  return price.toFixed(4);
}


// methods

export function percentDifference(crypto) {
  var decrease = crypto.priceChangePercent

  if (decrease > 0) {
    this.status.isUp = true
    this.status.isDown = false
    this.status.isStill = false
  } else if (decrease < 0) {
    this.status.isUp = false
    this.status.isDown = true
    this.status.isStill = false
  } else {
    this.status.isUp = false
    this.status.isDown = false
    this.status.isStill = true
  }
  return `${decrease} %`
}
