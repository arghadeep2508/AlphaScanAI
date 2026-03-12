from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd
import asyncio
import logging

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("price_api")


def fetch_price(symbol: str) -> float | None:
    """
    Fetch latest stock price using Yahoo Finance.
    Uses the same stable method as chart API.
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
            return float(df["Close"].iloc[-1])

    except Exception as e:
        logger.warning(f"yf.download failed for {symbol}: {e}")

    # fallback method
    try:
        ticker = yf.Ticker(symbol)

        df = ticker.history(
            period="6mo",
            interval="1d"
        )

        if df is not None and not df.empty:
            return float(df["Close"].iloc[-1])

    except Exception as e:
        logger.error(f"Fallback history failed for {symbol}: {e}")

    return None


@router.get("/price/{symbol}")
async def get_price(symbol: str):

    symbol = symbol.strip().upper()

    if not symbol:
        raise HTTPException(
            status_code=400,
            detail="Invalid stock symbol"
        )

    price = await asyncio.to_thread(fetch_price, symbol)

    if price is None:
        raise HTTPException(
            status_code=404,
            detail=f"No market data available for {symbol}"
        )

    return {
        "symbol": symbol,
        "price": price
    }
