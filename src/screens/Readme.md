## Screens:

1. **AccountSettingsScreen**:
   This screen contains the user's account settings those settings are:

- **Allow Notifications:** Allow the application to show notifications for users (Frontend and Backend remote notifications)
- **Receive Tips & Tricks:** Users can receive new articles and news (not finished yet).
- **Request Personal Data (GDPR):** The users can provide the email that they want to export their data as a csv file.
- **Delete Account:** Users can delete their account permanently.
- **Log Out:** Users can log out from their accounts.

2. **AddNewEmergencyContactScreen:** The users can Add new emergency contacts. This screen contains different input fields for the contact details.

3. **AddressScreen**: Users can enter their address during the sign-up process. This screen contains different fields to enter address details. Also, the **Current Location** button if the user wants to fill the input fields automatically.

4. **AuthScreen**: This screen is where the users choose how they want to sign up with our application. it contains:

- **Log In**: The users can log in to their accounts using a Google/apple account (using Cognito AWS service) or using manual email settings.
- **Sign Up**: The users can sign up the same way, either using a Google/apple account or manual email settings (In this case, users need to agree to the term & privacy policy. Then, they will receive an email to verify their account which will direct them to UserNameScreen to start the sign up process).

5. **Dashboard**: This represents the home screen. it contains sections and each section contains multiple cards.

- **Emergency System Settings**:

  - Manage Emergency Settings: it will direct the user to EmergencyContactSettingsScreen.
  - Automated Emergency System: it will direct the user to AutomatedEmergencySettingsScreen.

- **Sign up for Cryopreservation**:
  - Sign Up with Tomorrow Bio: it will direct the user to the SignUPForCryoprservation screen inside the application.
  - Sign Up with Alcor: it will direct the user to an external link to the Alcor website.
  - Sign Up with Cryonics Institute: it will direct the user to an external link to the Cryonics Institute website.
  - Sign Up with Southern Cryonics: it will direct the user to an external link to the Southern Cryonics website.

Also, the Dashboard screen contains an Emergency Button where the users can start an emergency situation manually.

6. **DateOfBirthScreen**: This screen is where users can add their date of birth during the sign up procedure. It contains a one feild to enter the date.

7. **EmergencyContactExplanationsScreen**: This screen contains details about why the users need to add new contacts. it will show up only when the users do not have added any contacts previously.

8. **EmergencyContactSettingsScreen**: users can customize their Emergency settings:

- EmergencyContact: users can add the contacts that they want to receive their emergency message in case of an emergency. The users can also modify or delete already existing contacts.
- Documents: users can upload the important documents that they want their emergency contacts to receive.
- EmergencyMessage: users can customize the message that will be sent to their emergency contacts. This message contains different options:
  - Location: Send a Google map URL for the user's last updated location.
  - Uploaded Documents: Send the documents that the user uploaded.
  - Message: The message that the users want to send to their contacts.

9. **ForgotPasswordScreen**: When users forget their password, they can enter their emails and receive a recovery link that directs them to NewPasswordScreen to enter a new password.

10. **HealthConditionErrorScreen**: This screen will be shown in two cases:

- Health Check (Bio-Trigger): when the application does not receive or detect any health data for the user during the already set time-frame.
- Time Check (Time-Trigger): if the user decided to use the automated system with time-trigger based, this screen will show to confirm that the user is still alive after the set time-frame.

11. **LostConnectionScreen**: This screen will be shown when there is no internet connection. it has two cases:

- Airplane Mode: The user turned on airplane mode.
- no internet: There is no internet connection.

12. **MedicalInfoScreen**: This screen will allow the users to enter their medical information.

13. **NewPasswordScreen**: Users who submitted lost password requests will redirected to this screen when they receive an email to reset their password.

14. **OnboardingScreen**: This is a screen used to onboard the user when they first open the application. it has two components:

- onboardSlide: The first and second slides.
- onboardSlideSummary: The third slide. it has (Login / Create New Account) buttons to navigate to the AuthScreen.

15. **PhoneNumberScreen**: Users can enter their phone number during the sign-up process.

16. **ProfileDefualtScreen**: This screen is used to give the user the ability to modify or add new data to their account. it contains three cards:

- Profile & User Data: it will navigate to the ProfileEditScreen.
- Account Settings: it will navigate to the AccountSettingsScreen.
- Medical Information: it will navigate to the MedicalInfoScreen.

17. **ProfileEditScreen**: Users can edit all their profile details (First Name - Last Name - Phone Number - Date of Birth - Full Address)

18. **SignUPForCryoprservation**: This screen will render the sign-up to Tomorrow Bio page to allow the users to sign up without the need to leave the application.

19. **SpecificTimePausedScreen**: it is part of the automated emergency system structure where the users have the ability to pause the automated system at certain times. it contains two methods:

- Pause Emergency System Now: This component is used to pause the automated system for the current time until a specific time the users will pick.
- Set-up Specific Times: The users can pick specific times and dates when they want to pause the system. The time slots can be deleted or modified. when the user wants to add a new time slot, it will open a [Modal](https://reactnative.dev/docs/modal) where they can enter the time slot details.

20. **UserNameScreen**: This screen is used to allow users to enter their full name during the sign-up process. it contains two fields (First Name and Last Name).
