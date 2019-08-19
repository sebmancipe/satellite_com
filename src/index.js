import React,{Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Doppler from './components/Doppler';
import Distance from './components/Distance'
import Main from './components/Main'
import {BrowserRouter, Route, Switch} from 'react-router-dom'


class Core extends Component{

    render() {
        return(
            <BrowserRouter>
                <Switch>
                    <Route path="/" component={Main} exact/>
                    <Route path="/doppler" component={Doppler} />
                    <Route path="/distance" component={Distance} />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<Core />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA

