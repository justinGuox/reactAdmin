import React, {Component} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'

import Login from "./pages/login/login";
import Admin from "./pages/admin/admin";

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch> {/*只匹配其中一个*/}
                    <Route path='/login' component={Login} />
                    <Route path='/' component={Admin} />
                </Switch>
            </BrowserRouter>
        )
    }
}

export default App
