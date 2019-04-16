const { ipcRenderer } = window.require('electron');
import React, { Component } from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import Input from './input/Input';
import 'react-circular-progressbar/dist/styles.css';
import './styles.css';

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isDownload: false,
            downloadPercent: 0
        };

        this.downloadStarted = this.downloadStarted.bind(this);

        ipcRenderer.on('download-status', this.downloadStarted);
    }

    downloadStarted(event, arg) {
        if (typeof arg === 'string') {
            this.setState({
                isDownload: true
            });
        } else if (typeof arg === 'object') {
            this.setState({
                downloadPercent: arg.percent
            });

            if (arg.percent === 100) {
                setTimeout(() => {
                    this.setState({
                        isDownload: false,
                        downloadPercent: 0
                    });
                }, 1000);
            }
        }
    }

    render() {
        return (
            <div>
                {this.state.isDownload ? 
                    <CircularProgressbar 
                    strokeWidth={6} 
                    percentage={this.state.downloadPercent}
                    text={`${this.state.downloadPercent}%`}
                    styles={{
                        width: '100px', 
                        height: '100px',
                        path: { stroke: `rgba(254, 134, 132, ${this.state.downloadPercent / 100})` },
                        text: { fill: '#f88', fontSize: '16px' },
                    }}/>
                :
                    <Input className='flex-item'/>
                }
            </div>
        );
    }
};
