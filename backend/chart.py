from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import pandas as pd
import asyncio
import logging
import requests
import yfinance as yf

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("chart_api")


class ChartData(BaseModel):
    time: str
    open: float
    high: float
    low: float
    close: float
    volume: float


# -------------------------------
# Yahoo Finance Direct API
# -------------------------------

def fetch_yahoo_api(symbol: str) -> pd.DataFrame:
    """
    Fetch stock data using Yahoo Finance Chart API
    Much more reliable than yfinance on cloud servers
    """

    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{symbol}"

    params = {
        "range": "6mo",
        "interval": "1d"
    }

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    try:
        r = requests.get(url, params=params, headers=headers, timeout=10)

        if r.status_code != 200:
            return pd.DataFrame()

        data = r.json()

        result = data["chart"]["result"][0]

        timestamps = result["timestamp"]
        indicators = result["indicators"]["quote"][0]

        df = pd.DataFrame({
            "Date": pd.to_datetime(timestamps, unit="s"),
            "Open": indicators["open"],
            "High": indicators["high"],
            "Low": indicators["low"],
            "Close": indicators["close"],
            "Volume": indicators["volume"]
        })

        return df

    except Exception as e:
        logger.warning(f"Yahoo API failed: {e}")
        return pd.DataFrame()


# -------------------------------
# Fallback yfinance
# -------------------------------

def fetch_yfinance(symbol: str) -> pd.DataFrame:

    try:
        ticker = yf.Ticker(symbol)

        df = ticker.history(
            period="6mo",
            interval="1d",
            auto_adjust=False,
            actions=False
        )

        if df is not None and not df.empty:
            df = df.reset_index()
            return df

    except Exception as e:
        logger.warning(f"yfinance fallback failed: {e}")

    return pd.DataFrame()


# -------------------------------
# Main fetch function
# -------------------------------

def fetch_stock_data(symbol: str) -> pd.DataFrame:

    # First try Yahoo API
    df = fetch_yahoo_api(symbol)

    if not df.empty:
        return df

    logger.info(f"Yahoo API empty for {symbol}, using yfinance fallback")

    # Fallback
    return fetch_yfinance(symbol)


# -------------------------------
# API Endpoint
# -------------------------------

@router.get("/chart/{symbol}", response_model=List[ChartData])
async def get_chart(symbol: str):

    try:
        symbol = symbol.strip().upper()

        if not symbol:
            raise HTTPException(status_code=400, detail="Invalid stock symbol")

        df = await asyncio.to_thread(fetch_stock_data, symbol)

        if df is None or df.empty:
            raise HTTPException(
                status_code=404,
                detail=f"No data found for symbol: {symbol}"
            )

        required_cols = ["Open", "High", "Low", "Close", "Volume"]

        for col in required_cols:
            if col not in df.columns:
                raise HTTPException(
                    status_code=500,
                    detail=f"Missing column '{col}'"
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

        logger.info(f"Chart data fetched for {symbol}")

        return data

    except HTTPException:
        raise

    except Exception as e:
        logger.error(f"Chart API error for {symbol}: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch chart data: {str(e)}"
        )
