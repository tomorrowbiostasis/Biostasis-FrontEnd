## Components:

1. **Alert:** An alert message is used to display an error message to users when there is an error during the authentication process.
2. **AuthButtons:** The buttons used on the AuthScreen:

   - RootAuthButton: the main component that contains the structure of the auth buttons.
   - GoogleButton: The button used to sign up/login using a Google account.
   - AppleButton: The button used to sign up/login using an Apple account.

3. **AuthInput**: The input felids used for manual authentication (Email & Password).
4. **BackButtonTrigger**: This component represents the back button used to navigate to previous screens inside the application.
5. **ConfirmationPopUp**: A popup message that will be shown when the user wants to delete critical information (Documents or Emergency Contact)
6. **Container**: it is the main component used in every screen inside the application to contain other JSX elements for each screen.
7. **DrawerContent**: The structure and items for the side drawer that are used to navigate through different screens inside the application.
8. **DrawerTrigger**: The component used to open the side drawer when the user clicks on the drawer icon.
9. **Input**: The input component is used to allow users to enter different types of information.
10. **IntervalSelect**: Select the component that is used to create a list of time-frames used in the AutomatedEmergencySettingsScreen.
11. **Loader**: Component used to show a loading icon during the async process (Fetching user's data or waiting until redux store to get updated).
12. **LogoutTrigger**: Component used to allow the user to log out from their account.
13. **PhoneNumberPicker**: Phone number input component used whenever the user needs to enter a phone number to make sure it's a valid number.
14. **RadioButton**: Component used to show radio type of choices.
15. **Switch & SwitchButton**: The switches used inside the application.
16. **TextArea**: Used inside the EmergencySettingsComponent inside the EmergencyContactsSettingsScreen.
