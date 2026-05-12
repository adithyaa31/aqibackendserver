import math
import numpy as np


def predict_aqi(pm25: float, pm10: float, o3: float = 0.0, no2: float = 0.0) -> float:
    """Simple ML-style calculation (standalone demo, NOT connected to any dataset).

    We use a tiny linear model with a non-linear feature expansion.
    This file is meant to demonstrate ML code structure for a calculation.
    """
    # Feature engineering (non-linear)
    x = np.array([
        1.0,
        pm25,
        pm10,
        o3,
        no2,
        pm25 ** 2,
        pm10 ** 2,
        math.sqrt(max(pm25, 0.0)),
        math.log1p(max(pm10, 0.0)),
    ], dtype=float)

    # Example weights (for demonstration only)
    w = np.array([
        5.0,
        0.25,
        0.12,
        0.08,
        0.05,
        0.0012,
        0.0007,
        1.8,
        0.6,
    ], dtype=float)

    y = float(x @ w)
    return max(0.0, y)


def train_demo_model(num_samples: int = 200, seed: int = 42):
    """Trains a tiny linear regressor on synthetic data.

    Again: demo code only—no connection to the rest of your app.
    """
    rng = np.random.default_rng(seed)

    # Synthetic inputs
    pm25 = rng.uniform(5, 250, size=num_samples)
    pm10 = rng.uniform(10, 300, size=num_samples)
    o3 = rng.uniform(0, 120, size=num_samples)
    no2 = rng.uniform(0, 100, size=num_samples)

    # Synthetic target with noise
    # (A realistic mapping isn't required here—only to show ML pipeline.)
    target = (
        8
        + 0.18 * pm25
        + 0.08 * pm10
        + 0.04 * o3
        + 0.03 * no2
        + 0.0009 * pm25**2
        + rng.normal(0, 8, size=num_samples)
    )

    # Build feature matrix with same expansion as predict_aqi
    X = np.vstack([
        np.ones(num_samples),
        pm25,
        pm10,
        o3,
        no2,
        pm25 ** 2,
        pm10 ** 2,
        np.sqrt(np.maximum(pm25, 0.0)),
        np.log1p(np.maximum(pm10, 0.0)),
    ]).T

    # Closed-form least squares: w = (X^T X)^-1 X^T y
    XtX = X.T @ X
    Xty = X.T @ target
    w = np.linalg.solve(XtX + 1e-6 * np.eye(XtX.shape[0]), Xty)

    return w


def demo():
    # Demo calculation
    pm25 = 65.0
    pm10 = 120.0
    o3 = 25.0
    no2 = 20.0

    aqi = predict_aqi(pm25=pm25, pm10=pm10, o3=o3, no2=no2)
    print(f"Demo predicted AQI (calc-only ML-style): {aqi:.2f}")

    w = train_demo_model()
    print(f"Demo trained weights (length={len(w)}):")
    print(w)


if __name__ == "__main__":
    demo()

