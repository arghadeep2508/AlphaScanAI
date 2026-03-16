from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import pandas as pd
import numpy as np
import joblib
import os

from backend.chart import router as chart_router
from backend.chart import fetch_stock_data


# -----------------------------
# FASTAPI APP
# -----------------------------

app = FastAPI(title="AlphaScanAI")

app.include_router(chart_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# LOAD ML MODEL
# -----------------------------

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "model", "stock_model.pkl")
FEATURE_PATH = os.path.join(BASE_DIR, "model", "features.pkl")

model = joblib.load(MODEL_PATH)
features = joblib.load(FEATURE_PATH)

features = [f.strip() for f in features]


# -----------------------------
# FEATURE ENGINEERING
# -----------------------------

def compute_features(df: pd.DataFrame):

    df = df.copy()

    df["return"] = df["Close"].pct_change()

    df["sma5"] = df["Close"].rolling(5).mean()
    df["sma10"] = df["Close"].rolling(10).mean()
    df["sma20"] = df["Close"].rolling(20).mean()

    df["volatility"] = df["Close"].rolling(10).std()

    df["ema12"] = df["Close"].ewm(span=12).mean()
    df["ema26"] = df["Close"].ewm(span=26).mean()

    df["macd"] = df["ema12"] - df["ema26"]

    delta = df["Close"].diff()
    gain = delta.clip(lower=0).rolling(14).mean()
    loss = (-delta.clip(upper=0)).rolling(14).mean()

    rs = gain / (loss.replace(0, np.nan))
    df["rsi"] = 100 - (100 / (1 + rs))

    std = df["Close"].rolling(20).std()
    df["bb_upper"] = df["sma20"] + 2 * std
    df["bb_lower"] = df["sma20"] - 2 * std

    df["momentum"] = df["Close"] - df["Close"].shift(10)

    df["volume_change"] = df["Volume"].pct_change()

    df["lag1"] = df["Close"].shift(1)
    df["lag2"] = df["Close"].shift(2)
    df["lag3"] = df["Close"].shift(3)
    df["lag5"] = df["Close"].shift(5)
    df["lag10"] = df["Close"].shift(10)

    df["trend_5"] = df["Close"].rolling(5).mean()
    df["trend_20"] = df["Close"].rolling(20).mean()

    df["trend_diff"] = df["trend_5"] - df["trend_20"]

    df["price_position"] = (
        (df["Close"] - df["bb_lower"]) /
        (df["bb_upper"] - df["bb_lower"])
    )

    df["return_3"] = df["Close"].pct_change(3)
    df["return_5"] = df["Close"].pct_change(5)

    df["volume_ratio"] = df["Volume"] / df["Volume"].rolling(10).mean()

    df = df.dropna()

    return df


# -----------------------------
# HELPER FUNCTION
# -----------------------------

def prob_to_expected_move(prob: float, horizon: str):
    """
    Convert model probability to estimated move %
    (heuristic approximation)
    """

    if horizon == "1D":
        return round(prob * 1.2, 2)

    if horizon == "5D":
        return round(prob * 3.0, 2)

    return 0.0


# -----------------------------
# PREDICTION API
# -----------------------------

@app.get("/predict/{symbol}")
def predict(symbol: str):

    try:

        symbol = symbol.upper()

        df = fetch_stock_data(symbol)

        if df is None or df.empty:
            return {"error": "No market data available"}

        if "Date" in df.columns:
            df = df.set_index("Date")

        df = compute_features(df)

        latest = df.iloc[-1].copy()
        latest["symbol_id"] = 1

        X = pd.DataFrame([latest])

        for col in features:
            if col not in X.columns:
                X[col] = 0

        X = X[features]

        pred = model.predict(X)[0]
        proba = model.predict_proba(X)[0].max()

        direction = "UP" if pred == 1 else "DOWN"

        price = float(df["Close"].iloc[-1])

        # 1 Day Forecast
        forecast_1d = {
            "horizon": "1D",
            "direction": direction,
            "confidence": round(float(proba), 2),
            "expected_move_pct": prob_to_expected_move(proba, "1D")
        }

        # 5 Day Forecast
        forecast_5d = {
            "horizon": "5D",
            "direction": direction,
            "confidence": round(float(proba * 0.9), 2),
            "expected_move_pct": prob_to_expected_move(proba, "5D")
        }

        return {
            "symbol": symbol,
            "price": price,
            "forecasts": [
                forecast_1d,
                forecast_5d
            ]
        }

    except Exception as e:

        return {
            "error": str(e)
        }
