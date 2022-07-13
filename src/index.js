// Polyfill fetch
import _fecth from "node-fetch";
if (!global.fetch) {
    global.fetch = _fecth;
}

// Environment
import dotenv from "dotenv";
const result = dotenv.config();
if (result.error) {
    throw result.error;
}

// Express app
import app from "./app.js";
app.listen(app.get('port'), () => {
    console.log(`App listening on port ${app.get('port')}!`);
});
