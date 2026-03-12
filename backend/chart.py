from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import yfinance as yf
import pandas as pd
import asyncio
import logging

router = APIRouter()

# -------------------------------
# Logging Setup
# -------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chart_api")


# -------------------------------
# Response Schema
# -------------------------------

class ChartData(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float


# -------------------------------
# Helper Function
# -------------------------------

def fetch_stock_data(symbol: str) -> pd.DataFrame:
    """
    Fetch stock data from Yahoo Finance.

    Strategy:
    1️⃣ Try yf.download()
    2️⃣ If empty → fallback to Ticker.history()
    """

    try:
        df = yf.download(
            tickers=symbol,
            period="6mo",
            interval="1d",
            auto_adjust=False,
            progress=False,
            threads=False
        )

        if df is not None and not df.empty:
            logger.info(f"yf.download worked for {symbol}")
            return df

        logger.warning(f"yf.download returned empty for {symbol}, trying fallback")

    except Exception as e:
        logger.warning(f"yf.download failed for {symbol}: {e}")

    # -------------------------------
    # Fallback Method
    # -------------------------------

    try:
        ticker = yf.Ticker(symbol)

        df = ticker.history(
            period="6mo",
            interval="1d",
            auto_adjust=False,
            actions=False
        )

        if df is not None and not df.empty:
            logger.info(f"Ticker.history fallback worked for {symbol}")
            return df

        logger.warning(f"Ticker.history returned empty for {symbol}")

    except Exception as e:
        logger.error(f"Fallback history fetch failed for {symbol}: {e}")

    return pd.DataFrame()


# -------------------------------
# API Endpoint
# -------------------------------

@router.get("/chart/{symbol}", response_model=List[ChartData])
async def get_chart(symbol: str):
    """
    Returns historical OHLCV chart data for a stock.
    Used by frontend charts.
    """

    try:
        symbol = symbol.strip().upper()

        if not symbol:
            raise HTTPException(
                status_code=400,
                detail="Invalid stock symbol"
            )

        # Run blocking IO in background thread
        df = await asyncio.to_thread(fetch_stock_data, symbol)

        if df is None or df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for symbol: {symbol}"
            )

        # Handle multi-index columns
        if isinstance(df.columns, pd.MultiIndex):
            df.columns = df.columns.get_level_values(0)

        # Reset index
        df = df.reset_index()

        if "Date" not in df.columns:
            raise HTTPException(
                status_code=500,
                detail="Date column missing in Yahoo Finance response"
            )

        required_cols = ["Open", "High", "Low", "Close", "Volume"]

        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(
                    status_code=500,
                    detail=f"Missing column '{col}' in Yahoo Finance data"
                )

        data: List[ChartData] = []

        for _, row in df.iterrows():

            if pd.isna(row["Open"]) or pd.isna(row["Close"]):
                continue

            data.append(
                ChartData(
                    time=row["Date"].strftime("%Y-%m-%d"),
                    open=float(row["Open"]),
                    high=float(row["High"]) if not pd.isna(row["High"]) else 0.0,
                    low=float(row["Low"]) if not pd.isna(row["Low"]) else 0.0,
                    close=float(row["Close"]),
                    volume=float(row["Volume"]) if not pd.isna(row["Volume"]) else 0.0
                )
            )

        if not data:
            raise HTTPException(
                status_code=404,
                detail=f"No usable chart data for symbol: {symbol}"
            )

        logger.info(f"Chart data returned for {symbol}")

        return data

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Chart API error for {symbol}: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chart data: {str(e)}"
        )
