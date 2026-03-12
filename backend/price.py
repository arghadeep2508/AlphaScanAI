from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper().strip()

    try:
        ticker = yf.Ticker(symbol)

        data = ticker.history(period="1d")

        if data is None or data.empty:
            return {
                "error": "no price data returned",
                "symbol": symbol
            }

        price = float(data["Close"].iloc[-1])

        return {
            "symbol": symbol,
            "price": price
        }

    except Exception as e:
        return {
            "error": str(e),
            "symbol": symbol
        }
