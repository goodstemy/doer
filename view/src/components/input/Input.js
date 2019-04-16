import React, { Component } from 'react';
import './styles.css';

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activated: false
        };

        this.switchSearch = this.switchSearch.bind(this);
    }

    switchSearch() {
        if (!this.state.activated) {
            this.setState({
                activated: true
            });
        }
    }

    getSearchButtonClass() {
        const baseClass = 'search-button';
        return this.state.activated ? `${baseClass} activated` : `${baseClass} not-activated`;
    }

    getSearchInputClass() {
        const baseClass = 'search-input';
        return this.state.activated ? `${baseClass} input-activated` : `${baseClass} input-not-activated`;
    }

    render() {
        return (
            <div>
                <div className={this.getSearchButtonClass()} onClick={this.switchSearch}>
                    <img className='search-icon' src='static/images/search-icon.png'/>
                </div>
                <input className={this.getSearchInputClass()} type='text' placeholder='Paste url to download...'/>
            </div>
            
        );
    }
};
