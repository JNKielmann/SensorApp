# Walk reminder

App that reminds you to take a walk once a while.  
Created for the lecutre context sensitive systems at the KIT.

The folder app contains the recording.html page that records motion and orientation sensor data and sends them to an InfluxDB.
For this app the context "sitting", "walking" and "biking" were recorded.

The forder training contains python notebooks for data analysis and training of a random forest model. The model is then exported to a javascript file.

The app.html page uses the trained classifier to predict the current context and alarms the user when he is sitting for too long. Moreover this alarm is only activated at work (this is determined by checking if the user rode a bike between 9:00 and 10:00 for at least 10 minutes).
