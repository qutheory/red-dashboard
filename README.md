<h1 align="center">
  <img src="https://user-images.githubusercontent.com/2535140/62013544-6b995d80-b194-11e9-9217-48df60681fdb.png" />
  <br /><br />
  vapor.red UI
</h1>

The official Dashboard for vapor.red.

This repository contains all code used for the Frontend for vapor.red. All code here is developed using VueJS, and connects to the backend Vapor application through https.

## Contribute

We are always happy to receive Pull Requests containing bug fixes or new features.

If you want to contribute to the Vapor Red dashboard, you can get it up and running locally, and test against your live account. To do this, start by adding environment variables, you need to setup the following:

```
VUE_APP_API_URL=api.vapor.red
VUE_APP_STRIPE_KEY=local
```

This will tell the app to connect to the live API.

After this, you can build and run the application. From the root of the application, run the following commands:

```
# install dependencies
npm install

# Run the application
npm run serve
```

This will start up the application in debug mode, with hot reload enabled.
