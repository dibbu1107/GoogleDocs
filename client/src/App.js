import TextEditor from "./TextEditor";
import SignUp from "./SignUp";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

// The main App component
function App() {
  return (
    <Router>
      <Switch>
        {/* Redirects the root path to the login page */}
        <Route path="/" exact>
          <Redirect to="/login" />
        </Route>

        {/* Renders the TextEditor component for document editing */}
        <Route path="/documents/:id">
          <TextEditor />
        </Route>

        {/* Renders the Login component for the login page */}
        <Route path="/login">
          <Login />
        </Route>

        {/* Renders the SignUp component for the signup page */}
        <Route path="/signup">
          <SignUp />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
