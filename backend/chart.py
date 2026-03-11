from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd

router = APIRouter()


@router.get("/chart/{symbol}")
def get_chart(symbol: str):
    """
    Fetch 6 months of daily OHLCV data for a stock symbol
    and return it in a JSON format suitable for charting.
    """

    try:
        # Download stock data
        df = yf.download(symbol, period="6mo", interval="1d")

        # Check if data exists
        if df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for symbol: {symbol}"
            )

        # Fix multi-index columns (sometimes happens with yfinance)
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # Reset index so Date becomes a column
        df = df.reset_index()

        data = []

        for _, row in df.iterrows():

            # Skip rows with missing values
            if pd.isna(row["Open"]) or pd.isna(row["Close"]):
                continue

            data.append({
                "time": row["Date"].strftime("%Y-%m-%d"),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": float(row["Volume"])
            })

        return data

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chart data: {str(e)}"
        )
