import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Pasar from './Pasar/Pasar';
export default class App extends React.Component{
    render() {
        let viewer = this.props.viewer;
        return (
            <div>
                <Router>
                        <Switch>
                            <Route
                                exact
                                path={'/'}
                                title={'Pasar'}
                                render={props => <Pasar {...props} viewer={viewer}/>}
                            />
                        </Switch>
                </Router>
            </div>
        );
    }
}
