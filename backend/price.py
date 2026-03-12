from fastapi import APIRouter
import yfinance as yf

router = APIRouter()


@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper()

    try:
        # Use download instead of Ticker.history
        df = yf.download(
            symbol,
            period="5d",
            interval="1d",
            progress=False,
            threads=False
        )

        if df is None or df.empty:
            return {"error": "No market data available"}

        price = float(df["Close"].iloc[-1])

        return {
            "symbol": symbol,
            "price": price
        }

    except Exception as e:
        return {"error": str(e)}
