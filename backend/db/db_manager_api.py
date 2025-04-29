import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "")))
from DB_Manager import DatabaseManager
import pandas as pd
from dotenv import load_dotenv, find_dotenv

load_dotenv()
print("Env file found at location: ", find_dotenv())


class DBManager(DatabaseManager):
    def __init__(self):
        super().__init__(tag="exp_HP")

    def load_forecasts_for_api(self, feeder_id):
        """Load forecasts for a feeder"""
        try:
            df = self.load_forecasts(
                feeder_id=feeder_id,
                version="v1.7_HP_Tuning_1",
                scenario_type="24hr",
                model_architecture_type="LSTM",
                tag="exp_HP",
            )
            if df.empty:
                return pd.DataFrame(columns=["target_timestamp", "forecast_value", "actual_value"])
            df = df.reset_index()[["target_timestamp", "forecast_value", "actual_value"]]
            df["target_timestamp"] = df["target_timestamp"].dt.strftime("%Y-%m-%dT%H:%M:%S%z")

            return df
        except Exception as e:
            print(f"Error loading forecasts for feeder {feeder_id}: {e}")
            return pd.DataFrame(columns=["target_timestamp", "forecast_value", "actual_value"])
