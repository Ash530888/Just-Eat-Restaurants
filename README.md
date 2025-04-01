Run dependencies.sh in your teminal/command line before progressing to ensure Node.js, npm, and dependencies in package.json are all installed.

If node.js isn't installed, install here: [https://nodejs.org/en/download](https://nodejs.org/en/download). npm (Node Package Manager) is installed by default when you install Node.js.


Then in the project directory, run:

### `node server.js`

You must run this command before running the React App otherwise you will run into errors with no data.
Runs the server/Node.js express server on port 5001 (you may change the port in the script server.js) which retrieves and returns the data from the Just Eat API.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Assumptions
- Can use AI's assistance (reasonably)
- I assumed I could have some fun and doesn't have to be serious :)

## Future Improvements/Works
- Additional Filters/toggles for specific food items: pizza, pasta, burgers, etc
- Add filters for dietary requirements (Cuisines data includes some)
- Add filters for offers e.g. £8 off (Cuisines data includes some)
    - currently these filters are wrongly included in the cuisines filter which may be confusing
- Add a "surprise me" button where a random restaurant is suggested based on your filters
- Instead of number of stars <star emoji>, have the filled in stars
- have a picture representing the cuisine on the plate before the user hovers and its replaced with the text
- It can definitely look more polished and professional: not the best grass background choice, pixelated images