import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
<<<<<<< HEAD
||||||| merged common ancestors
import "./index.css";
=======
import "./css/index.css";
>>>>>>> 6f10013ede4e08f4d300c29688c8fd3ec9ef07d6
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import "./css/index.css";

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById("root")
);

serviceWorker.unregister();