import React, { Component } from "react";
import Fetch from "../../modules/Fetch";

require("babel-polyfill");

const Loader = () => "Loading...";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React-Data-Fetching Basic Example</h1>
        </header>
        <Fetch
          loader={<Loader />} // Replace this with your lovely handcrafted loader
          url="https://api.github.com/users/octocat"
          timeout={5000}
        >
          {({ data }) => (
            <div>
              <h3>Username</h3>
              <p>{data.name}</p>
            </div>
          )}
        </Fetch>
      </div>
    );
  }
}

export default App;
