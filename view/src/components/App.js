const { ipcRenderer } = window.require("electron");
import React, { Component } from "react";
import CircularProgressbar from "react-circular-progressbar";
import Input from "./input/Input";
import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isDownload: false,
      downloadPercent: 0
    };

    this.downloadStarted = this.downloadStarted.bind(this);

    ipcRenderer.on("download-status", this.downloadStarted);
  }

  downloadStarted(event, arg) {
    console.log(arg);
    switch (typeof arg) {
      case "string":
        if (arg === "started") {
          this.setState({
            isDownload: true
          });
        } else if (arg === "finished") {
          setTimeout(() => {
            this.setState({
              isDownload: false,
              downloadPercent: 0
            });
          }, 1000);
        }
        break;
      case "object":
        this.setState({
          downloadPercent: arg.percent
        });
        break;
      default:
    }
  }

  render() {
    return (
      <div>
        {this.state.isDownload ? (
          <div className="container">
            <CircularProgressbar
              strokeWidth={6}
              percentage={this.state.downloadPercent}
              text={`${this.state.downloadPercent}%`}
              className="flex-item"
              styles={{
                width: "100px",
                height: "100px",
                path: {
                  stroke: `rgba(254, 134, 132, ${this.state.downloadPercent /
                    100})`
                },
                text: { fill: "#f88", fontSize: "16px" }
              }}
            />
          </div>
        ) : (
          <div className="container">
            <Input className="flex-item" />
            <div className="flex-item choose-folder-block">
              <img
                className="choose-folder-block__image"
                src="static/images/choose-folder.png"
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}
