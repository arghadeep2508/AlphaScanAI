from fastapi import APIRouter
import yfinance as yf
import pandas as pd

router = APIRouter()


@router.get("/price/{symbol}")
def get_price(symbol: str):

    symbol = symbol.upper().strip()

    try:

        df = yf.download(
            tickers=symbol,
            period="6mo",
            interval="1d",
            auto_adjust=False,
            progress=False,
            threads=False
        )

        # handle multi-index columns (sometimes yahoo returns this)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

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
