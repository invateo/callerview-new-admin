import { useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Admin from "./pages/admins";
import Adverts from "./pages/adverts";
import Users from "./pages/users";
import Downloads from "./pages/downloads";
import Videos from "./pages/videos";
import Settings from "./pages/settings";
import Categories from "./pages/settings/categories";
import Regions from "./pages/settings/regions";
import Login from "./pages/auth";
import ResetPassword from "./pages/auth/reset-password";
import ForgotPassword from "./pages/auth/forgot-password";
import { useDispatch, useSelector } from "react-redux";
import { getLoggedinUser } from "./store/actions";

const App = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin } = useSelector( state => state.utility);
  let token = localStorage.getItem("CallerView-XXX");

  useEffect(() => {
    if (token) {
      dispatch(getLoggedinUser());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

        return (
          <Router>
            <Switch>
              <Route exact path="/">{token ? <Redirect to="/dashboard" /> : <Login />}</Route>
              <Route path="/forgot-password">{token ? <Redirect to="/dashboard" /> : <ForgotPassword />}</Route>
              <Route
                path="/reset-password/:id" 
                render={() => token ? <Redirect to="/dashboard" /> : <ResetPassword />}
              />
              {token && (
                <>
                  <Route exact path="/dashboard" component={Dashboard} />
                  <Route path="/users" component={Users} />
                  <Route path="/videos" component={Videos} />
                  <Route path="/admins" component={Admin} />
                  <Route path="/adverts" component={Adverts} />
                  <Route path="/downloads" component={Downloads} />
                  <Route path="/categories" component={Categories} />
                  <Route path="/regions" component={Regions} />
                  {loggedinAdmin?.privileges?.includes("super admin") ? <Route path="/settings" component={Settings} /> : <Redirect to="/dashboard" />}
                </>
              )}
              <Route component={() => <Redirect to="/" />} />
            </Switch>
          </Router> 
        )
    }

export default App;
