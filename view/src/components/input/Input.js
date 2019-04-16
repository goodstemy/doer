const { ipcRenderer } = window.require('electron');
import React, { Component } from 'react';
import './styles.css';

function validURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activated: false
        };

        this.switchSearch = this.switchSearch.bind(this);
        this._handleKeyDown = this._handleKeyDown.bind(this);
    }

    _handleKeyDown(e) {
        if (e.key === 'Enter') {
            this.startDownload();
        }
    }

    switchSearch() {
        if (!this.state.activated) {
            this.setState({
                activated: true
            });
        }
    }

    startDownload() {
        const url = document.getElementById('search-input').value;
        if (!url || !validURL(url)) {
            return;
        }
        ipcRenderer.send('download-url', url);
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
                <div className={this.getSearchButtonClass()} onClick={() => !this.state.activated ? this.switchSearch() : this.startDownload()}>
                    <img className='search-icon' src='static/images/search-icon.png'/>
                </div>
                <input id='search-input' className={this.getSearchInputClass()} onKeyDown={this._handleKeyDown} type='text' placeholder='Paste url to download...'/>
            </div>
        );
    }
};
