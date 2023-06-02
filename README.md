# marine-rental-api
This repository contains back-end/api application for marine-rental, a FullStack networking web application. The application is deployed at:

# https://marine-rental.onrender.com/
Main features of this app has been describe in the front-end repository: https://github.com/MaciejM-S/marine-rental-front-end

The application has been deployed on Render as a node Web Service

This app has been created with the following tech-stack:

+  node
+  express
+  mongoDB whith mongoose (ODM) library
+  REST API
+  JWT
+  bcrypt
+  graphQL
+  REST API


To provide better undesrtanding of <b>/back-end</b> this description presents information about controllers, routers and functions directories and its subfiles giving you a better understanding of their purpose and functionality:

# Note that this app has been built before deploying it on render.

### controllers 
- `landingPage.js`:
- `landingPage.ts`: controllers for handling landing page operation -> excluding fetching vessels
- `user.js`: 
- `user.ts`: all controllers connected with user action -> siginingIn/Up, authorizing, adding/changing info, adding/removing favorites. 
- `vessel.js`:
- `vessel.ts`: actions connecting with fetching, filtering, sorting vessels.



### graphql
- `resolvers.js`: 
- `resolvers.ts`: Contains the resolvers for GraphQL schema.
- `schema.js`: 
- `schema.ts`: Defines the GraphQL schema for application.


### models

db models are based on User Schema and Comment Schem
Here is breakdow of the schema for <b>User</b> fields:

 + info (Object): Contains information about the user's personal details.
  - firstName (String, required): Represents the user's first name.
  - lastName (String, required): Represents the user's last name.
  - telephone (String): Represents the user's telephone number.
  
+ email (String, required): Represents the user's email address. It is a required field.
  -  (String, required): Represents the user's password. It is a required field.
  -  tokens (Array of Objects): Represents the authentication tokens associated with the user.
      -  token (String): Represents an authentication token.
      
+ avatar (Object): Contains information about the user's avatar.
  - date (String): Represents the date associated with the avatar.
  - data (Buffer): Represents the binary data of the avatar image.
  - description (String): Represents a description or caption for the avatar.
  
+ vessels (Array of Objects): Represents the user's vessels.
  - vesselId (String, ref: "vessel"): Represents the ID of a vessel associated with the user. It references the "vessel" model.
  
+ favorites (Array of Strings): Represents the user's favorite items, which can be of any type.

+ firstVessel (Boolean, default: true): Represents whether the user has a first vessel. It is set to true by default.
 
Here is breakdow of the schema for <b>Vessel</b> fields:
+ user (String, required, ref: "user"): Represents the ID of the user who owns the vessel. It references the "user" model.

+ name (String, required): Represents the name of the vessel.

+ description (String): Represents the description of the vessel.

+ location (String, required): Represents the location of the vessel.

+ year (Number, required): Represents the year the vessel was built.

+ size (String, required): Represents the size of the vessel.

+ type (String, required): Represents the type of the vessel.

+ pictures (Array of Objects): Represents the pictures of the vessel.
  - data (Buffer): Represents the binary data of a picture.
  
+ pricePerDay (Number): Represents the price per day to rent the vessel.
 
+ pricePerWeek (Number): Represents the price per week to rent the vessel.
 
+ pickupDay (String): Represents the day for vessel pickup.
 
+ returnDay (String): Represents the day for vessel return.

+ isFirstVessel (Boolean, default: false): Represents whether the vessel is the user's first vessel. It is set to false by default.


