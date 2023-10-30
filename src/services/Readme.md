### Services:

This is a small description of the services that the application uses to be functional.

1. **AsyncStorage**: This service is used to store the data in memory. it provides log messages to help the developer understand which keys and values have been fetched/set.

2. **Date**: The use of this service is to calculate pausing times for the automated system.

3. **TimeSlot**: This service is used to figure out the timing of the pausing slots for the frontend to communicate with the backend to set the pausing times correctly.

4. **Alert**: Start an alert sound to make sure the user is still alive.

5. **Amazon**: This service is used with Cognito to authenticate and authorize the users.

6. **API**: all the API requests we need to send to the backend.

7. **Background**: This service runs only on Android. it is used to start a background fetch service where it will keep the application running in the background and it will fetch the user's health data every 15 min.

8. **Battery**: This service runs only on Android and is used to stop battery optimization on the application cause some Android systems will stop our application (background fetch -> consume battery)

9. **BioCheck**: it will check the user's biodata (heart rate - resting heart rate - movement) to make sure that the user is still alive and send a positive signal to the backend.

10. **Emergency**: This service is responsible for starting or stopping the emergency process.

11. **Env**: Get the environment variables from the `.env` files.

12. **GoogleFit**: Only on Android, Used to fetch the health data for the user from their Google Fit account.

13. **Location**: Fetch the user's location and create a Google map URL to be saved and sent to the user's emergency contacts.

14. **Logger**: used to create a log file for debugging purposes.

15. **Notification**: This service is responsible for sending local notifications to the user and it works only on Android.

16. **Push**: The service used to handle remote messages sent from the backend using Firebase.

17. **Recommendation**: Used to calculate the recommendation period or time frame for users who are using the Bio trigger system. Every week the system will recommend new value.

18. **Time**: Used to calculate and fetch the paused date and time for the automated system based on the user's preferences.

19. **Toast**: Messages inside the application.

20. **Validation**: any validation needed when the user tries to enter data (Name - Phone number... etc.).
