from fastapi import APIRouter
import yfinance as yf # type: ignore
import pandas as pd

router = APIRouter()

@router.get("/chart/{symbol}")
def get_chart(symbol: str):

    df = yf.download(symbol, period="6mo", interval="1d")

    if isinstance(df.columns, pd.MultiIndex):
        df.columns = df.columns.get_level_values(0)

    df = df.reset_index()

    data = []

    for _, row in df.iterrows():
        data.append({
            "time": row["Date"].strftime("%Y-%m-%d"),
            "open": float(row["Open"]),
            "high": float(row["High"]),
            "low": float(row["Low"]),
            "close": float(row["Close"]),
            "volume": float(row["Volume"])
        })

    return data