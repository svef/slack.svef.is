import React, { Component } from 'react'
import axios from 'axios'

import Slack from './Slack'
import SVEF from './SVEF'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      email: '',
      valid: false,
      submitted: false,
      success: null,
      error: ''
    }
  }

  handleInputKeyPress(event) {
    if (this.state.valid && event.key === 'Enter') {
      this.submit()
    }
  }

  handleInputChange(event) {
    this.setState({
      email: event.target.value,
      valid: event.target.value && event.target.value.indexOf('@') >= 1,
    })
  }

  submit() {
    if (this.state.valid) {
      this.setState({
        submitted: true,
        error: ''
      })
      axios
        .post('https://api.svef.is/slack', { email: this.state.email })
        .then(({ data }) => {
          if (!data.ok && data.error === 'already_invited') {
            this.setState({
              lastEmail: this.state.email,
              submitted: false,
              success: null,
              error: data.error
            })
          } else {
            this.setState({
              success: data.ok,
              error: data.ok ? '' : data.error
            })
          }
        })
    }
  }

  render() {
    return (
      <div className="App">
        <div className="App-logos">
          <SVEF />
          <Slack />
        </div>
        <p className="App-intro">
          Komdu og vertu með okkur á Slack
        </p>
        <div className={`App-form ${this.state.submitted && 'submitted'}`}>
          <input
            className="App-input"
            type="email"
            placeholder="svef@svef.is"
            onChange={this.handleInputChange.bind(this)}
            onKeyPress={this.handleInputKeyPress.bind(this)}
          />
          <button
            className={`App-button ${this.state.valid && 'active'}`}
            onClick={this.submit.bind(this)}
          >
            Fá boð
          </button>
          <p className="App-login">
            eða <a href="https://vefidnadurinn.slack.com">skráðu þig inn</a>
          </p>
          {this.state.success &&
            <p className="App-submitted App-login">
              Vel gert! Þú ættir að fá tölvupóst á {this.state.email}
              <br />
              <a
                href="#_"
                onClick={() => {
                  this.setState({
                    submitted: false,
                    valid: false,
                    success: null,
                  })
                }}
              >
                Bæta við öðru netfangi
              </a>
            </p>}
          {this.state.error === 'already_invited' && 
            <p className="App-submitted App-already-invited">
              {this.state.lastEmail} hefur þegar verið boðið í slack teymið, svo þú getur farið beint og <a href="https://vefidnadurinn.slack.com">skráð þig inn</a>.
            </p>
          }
          {this.state.submitted && this.state.success === false && this.state.error === '' &&
            <p className="App-submitted App-failure">
              Reyndi að senda tölvupóst á
              {' '}
              {this.state.email}
              {' '}
              en eitthvað kom uppá :/
              {' '}
              <a
                href="#_"
                onClick={() => {
                  this.setState({
                    submitted: false,
                    valid: false,
                    success: null,
                  })
                }}
              >
                Reyndu aftur
              </a>
              , eða sendu póst á
              {' '}
              <a href="mailto:svef@svef.is">svef@svef.is</a>
              .
            </p>}
          {this.state.submitted && this.state.success === null &&
            <p className="App-submitted">
              Augnablik…
            </p>}
        </div>
      </div>
    )
  }
}

export default App
