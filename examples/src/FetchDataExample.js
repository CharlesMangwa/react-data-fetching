import React, { Component } from "react"
import Fetch from "../../modules/FetchData"

require("babel-polyfill")

const fakeFetch = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({
        name: "User A"
      })
    }, 1000)
  })
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React-Data-Fetching &ltFetchData /&gt Example</h1>
          <h3>You can use an url or a fetch function</h3>
        </header>
        <div style={{ float: "left", width: "30%" }}>
          <h3>Using fetch prop</h3>
          <Fetch
            fetch={fakeFetch}
            subscribe={{
              onWillMount: () => console.log("Component will mount"),
              onDidMount: () => console.log("Component has mounted"),
              onSuccess: (data) => console.log("Data has been updated!", data)
            }}
          >
            {(props) => {
              return (
                <div>
                  {props.data.cata({
                    SUCCESS: _data => (
                      <div>
                        <h3>Username</h3>
                        <p>{_data.name}</p>
                      </div>
                    ),
                    FAILURE: error => <div>Something went wrong!</div>,
                    LOADING: () => <div>Loading...</div>,
                    INIT: () => <div>Nothing Loaded Yet.</div>
                  })}
                  <button onClick={props.run}>Refetch</button>
              </div>
            )}}
          </Fetch>
        </div>
        <div style={{ float: "left", width: "30%" }}>
          <h3>Using fetch and lazy option</h3>
          <Fetch
            fetch={fakeFetch}
            subscribe={{
              onWillMount: () => console.log("Component will mount"),
              onDidMount: () => console.log("Component has mounted"),
              onSuccess: (data) => console.log("Data has been updated!", data)
            }}
            options={{ lazy: true }}
          >
            {(props) => {
              return (
                <div>
                  {props.data.cata({
                    SUCCESS: _data => (
                      <div>
                        <h3>Username</h3>
                        <p>{_data.name}</p>
                      </div>
                    ),
                    FAILURE: error => <div>Something went wrong!</div>,
                    LOADING: () => <div>Loading...</div>,
                    INIT: () => <div>Nothing Loaded Yet.</div>
                  })}
                  <button onClick={props.run}>Refetch</button>
              </div>
            )}}
          </Fetch>
        </div>
        <div style={{ float: "left", width: "30%" }}>
          <h3>Using url prop</h3>
          <Fetch
            url="https://api.github.com/users/octocat"
            subscribe={{
              onWillMount: () => console.log("Component will mount"),
              onDidMount: () => console.log("Component has mounted"),
              onSuccess: (data) => console.log("Data has been updated!", data)
            }}
          >
            {(props) => {
              return (
                <div>
                  {props.data.cata({
                    SUCCESS: _data => (
                      <div>
                        <h3>Username</h3>
                        <p>{_data.name}</p>
                      </div>
                    ),
                    FAILURE: error => <div>Something went wrong!</div>,
                    LOADING: () => <div>Loading...</div>,
                    INIT: () => <div>Nothing Loaded Yet.</div>
                  })}
                  <button onClick={props.run}>Refetch Url</button>
              </div>
            )}}
          </Fetch>
        </div>
      </div>
    )
  }
}

export default App
