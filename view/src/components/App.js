import React, { Component } from 'react';
import Input from './input/Input';
import './styles.css';

export default class App extends Component {
    render() {
        return (
            <div>
                <Input className="flex-item"/>
            </div>
        );
    }
};
