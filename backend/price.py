from fastapi import APIRouter
import yfinance as yf

router = APIRouter()


@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper().strip()

    df = yf.download(
        symbol,
        period="6mo",
        interval="1d",
        progress=False
    )

    # SAFETY CHECK
    if df is None or df.empty:
        return {
            "error": "market data fetch failed",
            "symbol": symbol
        }

    latest_price = float(df["Close"].iloc[-1])

    return {
        "symbol": symbol,
        "price": latest_price
    }
