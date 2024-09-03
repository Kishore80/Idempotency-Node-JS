A simple Node Application Demonstrating Idempotency API's. 
The API's developed here mimic's Key Scenarios of Idempotency by considering a Payment System.

Scenarios Considered here

1. User Initiates Payment for the first time

1.1   User Initiates Payment for the first time 
1.2   Payment Completed Successfully

2. User Initiates a brand new payment

2.1    Payment Completed Successfully
2.1.1  But due to some reason the Client did not receive the response from backend.
2.1.2  User attempt to retry the Payment (without knowing that the Payment has already successful)
2.1.3  Using the Idempotency Key Value , We return the Status to the user without retrying the API. [Real Use of Idempotency Key plays here]

2.2    Payment Not Completed (Neither Success Nor Failure) . It is still Pending State.
2.2.1  But due to some reason the Client did not receive the response from backend.
2.2.2  User attempt to retry the Pending Payment
2.2.3  To simplify the use case , I chose to invoke the Pending Payment in the backend

API 

1. Generate Idempotency Key
    * Backend Should Serve a Unique Key which will act as Idempotency Key to control the Payment Invocation

2. Invoke Payment
    * This API might invoke the Payment System or not depending on the Idempotency Key

3. Update Payment Status
    * This API mimics the scenario where Payment Service Provider (PSP) returns the Backend system with the Payment Status.
    * Here in the application , This API will do the task manually without the integration of any PSP.


Data Storage

1. Redis (Primary Check)
2. Mongo (Secondary Check)

* Redis will perform the Priamry Validation before Triggering the Payment based on Duplicate Request or Valid Request


Using Idempotency 
1. We achieved a function to return a same state of response even during duplicate API hits and this allows the application to create duplicate records in the Data Layer.
2. We could implement additional features like setting up TTL for a Key and add more business logics on top of these API's
