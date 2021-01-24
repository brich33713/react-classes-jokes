import React, { useState, useEffect } from "react";
import axios from "axios";
import Joke from "./Joke";
import "./JokeList.css";
import { render } from "react-dom";

class JokeList extends React.Component{
  constructor(props){
    super(props)
    this.numJokesToGet = 10;
    this.state = { jokes: []}
    this.generateNewJokes = this.generateNewJokes.bind(this)
    this.vote = this.vote.bind(this)
  }

  /* get jokes if there are no jokes */
  componentDidMount() {
    if (this.state.jokes.length < this.numJokesToGet) this.getJokes();
  }

  componentDidUpdate() {
    if (this.state.jokes.length < this.numJokesToGet) this.getJokes();
  }
  
  async getJokes() {
      let j = [...this.state.jokes];
      let seenJokes = new Set();
      try {
        while (j.length < this.numJokesToGet) {
          console.log("should repeat")
          let res = await axios.get("https://icanhazdadjoke.com", {
            headers: { Accept: "application/json" }
          });
          let { status, ...jokeObj } = res.data;
          let votes = 0;
          j.push({...jokeObj,votes})
          console.log(jokeObj)
        }
        this.setState({jokes: j});
        console.log(this.state.jokes)
      } catch (e) {
        console.log(e);
      }
    }

  // if (this.state.jokes.length === 0) this.getJokes();

  /* empty joke list and then call getJokes */

  generateNewJokes(){
    this.setState({jokes: []});
  }


  /* change vote for this id by delta (+1 or -1) */

  vote(id, delta) {
    this.setState(jokes => (
      {
      jokes: jokes.jokes.map(j => (j.id === id ? { ...j, votes: j.votes + delta } : j))
    }));
  }

  /* render: either loading spinner or list of sorted jokes. */
  render(){
  if (this.state.jokes.length) {
    let sortedJokes = [...this.state.jokes].sort((a, b) => b.votes - a.votes);
  
    return (
      <div className="JokeList">
        <button className="JokeList-getmore" onClick={this.generateNewJokes}>
          Get New Jokes
        </button>
  
        {sortedJokes.map(j => (
          <Joke text={j.joke} key={j.id} id={j.id} votes={j.votes} vote={this.vote} />
        ))}
      </div>
    );
  }

  return null;
  }
}

export default JokeList;
