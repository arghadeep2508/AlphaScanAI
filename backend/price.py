from fastapi import APIRouter
import yfinance as yf

router = APIRouter()


@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper().strip()

    try:
        df = yf.download(
            symbol,
            period="6mo",
            interval="1d",
            progress=False
        )

        if df is None or df.empty:
            return {
                "error": "yfinance returned empty dataframe",
                "symbol": symbol
            }

        latest_price = float(df["Close"].iloc[-1])

        return {
            "symbol": symbol,
            "price": latest_price
        }

    except Exception as e:
        return {
            "error": str(e),
            "symbol": symbol
        }
