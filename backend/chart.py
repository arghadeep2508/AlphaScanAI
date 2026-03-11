from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd

router = APIRouter()


@router.get("/chart/{symbol}")
def get_chart(symbol: str):
    """
    Fetch 6 months of daily OHLCV data for a stock symbol
    and return it in JSON format for frontend charting.
    """

    try:
        # Use Ticker API (more reliable on cloud servers)
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="6mo", interval="1d")

        # Validate data
        if df is None or df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for symbol: {symbol}"
            )

        # Reset index so Date becomes column
        df = df.reset_index()

        # Handle Date/DATETIME naming differences
        date_column = "Date" if "Date" in df.columns else "Datetime"

        # Ensure required columns exist
        required_cols = ["Open", "High", "Low", "Close", "Volume"]
        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(
                    status_code=500,
                    detail=f"Missing column {col} in stock data"
                )

        # Convert dataframe rows into chart format
        data = [
            {
                "time": row[date_column].strftime("%Y-%m-%d"),
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": float(row["Volume"]),
            }
            for _, row in df.iterrows()
            if pd.notna(row["Open"]) and pd.notna(row["Close"])
        ]

        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No valid chart data for symbol: {symbol}"
            )

        return data

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chart data: {str(e)}"
        )
