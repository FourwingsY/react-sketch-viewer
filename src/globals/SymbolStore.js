class SymbolStore {
	symbolMap = {}

	setMasters(symbolMasters = []) {
		symbolMasters.forEach(symbol => {
			this.symbolMap[symbol.symbolID] = symbol
		})
	}

	getSymbol(symbolID) {
		return this.symbolMap[symbolID]
	}

}

const instance = new SymbolStore()

export default instance