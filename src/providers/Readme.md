## Providers:

This directory holds the provider for redux-toolkit, plus other listeners that get executed before initializing the redux store:

1. **AuthListener**:

- Check the status of the user (is it logged in or not).
- Set up the user's authentication credentials.
- Check connection to Google Fit.
- Initiating a new token for Firebase remote notifications.

2. **AutomatedSystemListener**: Check the status and handle the changes in the automated system.

3. **NotificationListener**: Run a listener for remote notifications coming from Firebase.
