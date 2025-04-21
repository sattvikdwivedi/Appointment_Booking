import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import { GoogleOAuthProvider } from '@react-oauth/google';


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="1035397233912-m74gns9q9cgb9n5qb6n24khjtp3iqk6e.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </Provider>
);
