## Custom Hooks:

1. **UseAppState**: Check the state of the application (active, background.. etc.).

2. **UseBioTriggerValid**: Check the conditions for the automated system (bio-based trigger):

- IOS: automated system, bio trigger and Apple watch connected switches all on
- Android: automated system, bio trigger, Google Fit authentication, Google Fit connected and Background mode switches all on.

3. **UseDidUpdateEffect**: Make sure to not render the useEffect hook multiple times on the same screen.

4. **UseGeoPosition**: Get the current location.

5. **UseGoogleFitAuthStatus**: There are two hooks:

- IOS: we don't use Google Fit with IOS devices so it will return null values.
- Android: Make sure that the user is connected to a Google Fit account.

6. **UseInterval**: Hook used with the manual emergency process to manage the **_Starting an emergency_** counter.

7. **UseNavigateWithLogic**: Hook to manage the logic for adding new contacts.

8. **UseTimeSlotPauseStatus**: Make sure that the system is not paused using the specific times slots.
