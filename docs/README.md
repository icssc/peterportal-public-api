![petr](https://github.com/icssc-projects/peterportal-public-api/blob/master/public/images/peterportal-banner-logo.png?raw=true)

PeterPortal Public API provides software developers with easy-access to UC Irvine publicly available data such as: courses information, professor information, grade distribution, and schedule of classes.

🔨 Built with:

- Express.js
- GraphQL
- Serverless
- MkDocs

👯‍♂️ Works with:

- ElasticSearch
- SQL
- AWS

## Our Mission

🎇 Our mission is to improve the UCI student experience with course planning and encourage student software developers to create open-source applications that are beneficial to the Anteater community.

## Documentation

📃 Our documentation can be found at [api.peterportal.org](https://api.peterportal.org/docs/)

## Where does the data come from?

We consolidate our data directly from official UCI sources such as: UCI Catalogue, UCI Public Records Office, and UCI Webreg. We routinely monitor for updates to ensure you get the most accurate information to serve on your application.

## Disclaimer

👩‍💻 We are currently in the early stages for this project. Anyone is welcome to integrate this API into your project as a tool. However, if you choose to do so, please be aware that this project is currently in its early release phase. Every user will be considered as testers and are highly encouraged to do their part and submit a bug report if you encounter any issues. Our team will respond as quickly as possible to resolve the issue.

## Bug Report

🐞 If you encountered any issues or bug, please open an issue @ https://github.com/icssc-projects/peterportal-public-api/issues/new

## Other Disclaimer

✅ Although we consolidate our data directly from official UCI sources, this application is by all means, not an official UCI tool. We strive to keep our data as accurate as possible with the limited support we have from UCI. Please take that into consideration while using this API.

## Terms & Conditions

📜 There are no hard policies at the moment for utilizing this tool. However, please refrain from abusing the API by methods such as: sending excessive amount of requests in a small period of time or purposely looking to exploit the system. This tool is here mainly to assist developers in bringing their idea to life to benefit all UCI students. Please don't ruin it for others! 🙂

## Setting up to develop the project locally

1. Clone the `peterportal-public-api` repository to your local machine.
   ```
   git clone git@github.com:icssc-projects/peterportal-public-api.git
   ```
2. Change into the project directory.
   ```
   cd peterportal-public-api
   ```
3. Install the dependencies
   ```
   npm install
   ```
4. Start the development server
   ```
   npm start
   ```
   If you want to see the logs run
   ```
   npm start -- --log
   ```
5. The site should load on http://localhost:8080
   As you make changes to the Express application, those changes will be automatically reflected in the API.

If you're making changes to the documentation, you can upload see how we do it in our documentation. https://api.peterportal.org/Contributing/documenting/
