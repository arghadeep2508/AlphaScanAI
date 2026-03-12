from fastapi import APIRouter, HTTPException
import yfinance as yf
import pandas as pd
import asyncio
import logging

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("price_api")


def fetch_price(symbol: str):

    try:
        # Use longer period to ensure data availability
        df = yf.download(
            tickers=symbol,
            period="1mo",
            interval="1d",
            progress=False,
            threads=False
        )

        if df is None or df.empty:
            return None

        return float(df["Close"].iloc[-1])

    except Exception as e:
        logger.error(f"Price fetch failed: {e}")
        return None


@router.get("/price/{symbol}")
async def get_price(symbol: str):

    symbol = symbol.strip().upper()

    if not symbol:
        raise HTTPException(status_code=400, detail="Invalid stock symbol")

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
