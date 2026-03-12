from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper()

    try:
        ticker = yf.Ticker(symbol)
        data = ticker.history(period="1d")

        if data.empty:
            return {"error": "No market data available"}

        price = float(data["Close"].iloc[-1])

        return {
            "symbol": symbol,
            "price": price
        }

    except Exception as e:
        return {"error": str(e)}
