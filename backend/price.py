from fastapi import APIRouter
import yfinance as yf
import pandas as pd

router = APIRouter()

@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper().strip()

    try:
        # use same download logic as chart endpoint
        df = yf.download(symbol, period="6mo", interval="1d", progress=False)

        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        if df.empty:
            return {
                "error": "no market data available",
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
