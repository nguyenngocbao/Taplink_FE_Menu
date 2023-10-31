# Tap Link Front End Project

[TODO] Description for tap link 

## 🧑‍💻 Get Started

You will be invited to the project first. Then, you have to setup ssh for this project

Prerequisites:

- Node 20+
- Yarn 1.22+
- Setup ssh 
- VSVode
- Installing [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extentions

To set up the app execute the following commands.

```bash
git clone git@github.com:nguyenngocbao/Taplink_FE_Menu.git
cd Taplink_FE_Menu
touch .env.local
yarn install
```

##### `yarn dev`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

##### `yarn build`

Builds the app for production to the `.next` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

##### `yarn start`

Runs the app in the production mode.\
Require `yarn build` before

## 📂 Project Structure

The code in the root folder looks like this:

```sh
src
|
+-- .husky            # You can catch hooks when you commit or push, see more at https://typicode.github.io/husky/#/
|
+-- .next             # build folder of NextJS, see more at https://nextjs.org/docs/app/building-your-application/deploying
|
+-- .vscode           # vscode editor configuration
|
+-- public            # folder contains static file which is not used by your app when it compiles
|
+-- src               # main source code
|
+-- .env.local        # environment variables for your own local

```

Most of the code lives in the `src` folder should be common and looks like this:

```sh
src
|
+-- apis              # shared apis function and api route definition
|
+-- app               # app routes defined by Nextjs
|
+-- components        # shared, pure components used across the entire application (define component props types into file)
|
+-- constants         # shared constants used across the entire application
|
+-- hooks             # shared hooks used across the entire application
|
+-- lib               # re-exporting different libraries preconfigured for the application
|
+-- stores            # global state stores with Redux
|
+-- types             # base, common types used across the application
|
+-- utils             # shared utility functions
```

Most of the code lives in the `src/components` folder and looks like this:

```sh
components
|
+-- Elements          # all pure components which is not related to business logic, it can be used anywhere
|
+-- Layouts           # all layout components
```

Most of the code lives in the `src/app` folder defined by [app routing convention](https://nextjs.org/docs/getting-started/project-structure#app-routing-conventions). This is our own complementary convention:

```sh
Note: The following files are optional, related only to the business logic of that route or its children, and should be used by sibling or child routes.
app
|
+-- _icons            # all icon components
|
+-- _components       # all components
|
+-- apis.tsx          # all apis 
|
+-- constants.tsx     # all constants
|
+-- types.tsx         # all types
|
+-- utils.tsx         # all utils
```

## 🌳 Git branch name convention

### Feature: 

Create a new branch from the `develop` branch, branch name follows this pattern `feature/TaskNo_TaskName`.
Ex: `feature/PRO-10_Login`

### Bug: 

Should confirm where should branch checkout from. Branch name follows pattern `fix/TaskNo_TaskName`.
Ex: `fix/PRO-10_Login`

### Production bug: 

Should confirm where should branch checkout from. Branch name follows patterns `hotfix/TaskNo_TaskName`.
Ex: `hotfix/PRO-10_Login`
