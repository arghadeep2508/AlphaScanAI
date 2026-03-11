from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd

router = APIRouter()


@router.get("/chart/{symbol}")
def get_chart(symbol: str):

    try:
        # Download stock data (more stable config)
        df = yf.download(
            tickers=symbol,
            period="6mo",
            interval="1d",
            auto_adjust=False,
            progress=False,
            threads=False
        )

        if df is None or df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for symbol: {symbol}"
            )

        # Fix multi-index columns
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # Reset index to access Date column
        df = df.reset_index()

        # Ensure Date column exists
        if "Date" not in df.columns:
            raise HTTPException(
                status_code=500,
                detail="Date column missing in yfinance response"
            )

        data = []

        for _, row in df.iterrows():

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

        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No usable chart data for symbol: {symbol}"
            )

        return data

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chart data: {str(e)}"
        )
