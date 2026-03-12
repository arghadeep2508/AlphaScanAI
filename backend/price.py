from fastapi import APIRouter
import yfinance as yf

router = APIRouter()

@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper().strip()

    try:
        ticker = yf.Ticker(symbol)

        # request more data (cloud servers often fail with 1d)
        df = ticker.history(period="5d")

        if df.empty:
            return {
                "error": "no market data available",
                "symbol": symbol
            }

        price = float(df["Close"].iloc[-1])

        return {
            "symbol": symbol,
            "price": price
        }

    except Exception as e:
        return {
            "error": str(e),
            "symbol": symbol
        }
