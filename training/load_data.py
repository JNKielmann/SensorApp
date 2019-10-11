from influxdb import InfluxDBClient
import pandas as pd


def load_data_from_influxdb():
    """
    Load sensor data from influx db and set the timestamp as index
    :return: data frame containing sensor data
    """
    cli = InfluxDBClient(database='training')
    sensor_data = pd.DataFrame(cli.query('select * from sensorData', epoch='ns')['sensorData'])
    sensor_data = sensor_data.set_index("time")
    sensor_data.index = pd.to_datetime(sensor_data.index, unit='ms')
    return sensor_data


def create_data_windows(timeseries_data, window_length):
    """
    Groups the data into windows with specified length and computes some features
    :param timeseries_data: data to group into windows
    :param window_length: time length of a window
    :return: data frame with windowed data
    """
    # Drop a few samples at the end of each time series
    data = timeseries_data.groupby(["subject", "context"]).apply(lambda x: x.iloc[:-20])
    data.index = data.index.droplevel().droplevel()
    # Create windows of 1 second and compute min, max, mean and std as features
    window_features = data \
        .groupby(pd.Grouper(freq=window_length)) \
        .agg(["min", "max", "mean", "std"]) \
        .dropna()

    # Compute label for each window
    window_labels = data[["subject", "context"]] \
        .groupby(pd.Grouper(freq=window_length)) \
        .first() \
        .dropna()

    window_labels["count"] = data["subject"] \
        .groupby(pd.Grouper(freq='2000ms')) \
        .count() \
        .dropna()

    # Rename column names and join features with labels
    window_features.columns = [col[0] + "_" + col[1] for col in window_features.columns]
    result = window_labels.join(window_features).dropna()
    # drop windows with too few samples
    result = result[result["count"] >= 15].drop(["count"], axis=1)
    return result.dropna()


def split_X_y(data):
    """
    Split data into features X and labels y
    :param data: data frame with labels and features
    :return: features X and labels y
    """
    # convert strings to numbers
    y = data["context"].map(
        {"Sitzen": 0, "Laufen": 1, "Fahrrad": 2, "Fahrrad ": 2}
    ).to_numpy()
    X = data.drop(["context", "subject"], axis=1).to_numpy()
    return X, y
