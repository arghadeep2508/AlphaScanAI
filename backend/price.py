from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd
import asyncio
import logging

router = APIRouter()

# -------------------------------
# Logging Setup
# -------------------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("price_api")


# -------------------------------
# Helper Function
# -------------------------------

def fetch_price(symbol: str) -> float | None:
    """
    Fetch latest stock price from Yahoo Finance.
    Uses download first, then fallback to Ticker.history().
    """

    try:

        df = yf.download(
            tickers=symbol,
            period="5d",
            interval="1d",
            auto_adjust=False,
            progress=False,
            threads=False
        )

        if df is not None and not df.empty:
            return float(df["Close"].iloc[-1])

        logger.warning(f"yf.download returned empty for {symbol}")

    except Exception as e:
        logger.warning(f"yf.download failed for {symbol}: {e}")

    # -------------------------------
    # Fallback method
    # -------------------------------

    try:

        ticker = yf.Ticker(symbol)

        df = ticker.history(
            period="5d",
            interval="1d",
            auto_adjust=False,
            actions=False
        )

        if df is not None and not df.empty:
            return float(df["Close"].iloc[-1])

    except Exception as e:
        logger.error(f"Fallback history failed for {symbol}: {e}")

    return None


# -------------------------------
# API Endpoint
# -------------------------------

@router.get("/price/{symbol}")
async def get_price(symbol: str):

    symbol = symbol.strip().upper()

    if not symbol:
        raise HTTPException(
            status_code=400,
            detail="Invalid stock symbol"
        )

    try:

        price = await asyncio.to_thread(fetch_price, symbol)

        if price is None:
            raise HTTPException(
                status_code=404,
                detail=f"No market data available for {symbol}"
            )

        logger.info(f"Price fetched for {symbol}")

        return {
            "symbol": symbol,
            "price": price
        }

    except HTTPException:
        raise

    except Exception as e:

        logger.error(f"Price API error for {symbol}: {str(e)}")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch price: {str(e)}"
        )
