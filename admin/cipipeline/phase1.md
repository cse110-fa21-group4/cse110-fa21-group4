# CI/CD Pipeline Phase 1
![Pipeline Diagram](phase1.png)
## Currently Working:
We have a lot of our pipeline set up at this point:
1. Linting: We have configuration to lint within Visual Studio Code and on every pull request. On the pull request this may be manually overridden or used as a reason
   to send the code back to the author for cleanup.
2. Code Quality via Tool: Code Climate has been set up on the repository and checks every pull request for code smells and the like.
3. Code Quality via Human Review: Every pull request needs to be reviewed by someone who has admin access who must visually go over the code and make sure it is worth committing.
4. Documentation Generation and Hosting: Every time a pull request is merged into `main`, the js files are read and compiled into a website that hosts the information
   about each of the 

## Yet to do:
1. Deployment: we do not have a way to deploy to the Internet set up yet. Heroku is a possible idea. This will also be where code is minified before deployment to make it faster.
2. Testing: Unit and end-to-end tests to verify that our code works and behaves correctly.