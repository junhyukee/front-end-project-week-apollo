import React, { Component } from 'react';
import './App.css';
import { connect } from 'react-redux';
import { withRouter, Route } from 'react-router-dom';
import * as actions from './actions'
import Notes from './components/Notes';
import SingleNote from './components/SingleNote';
import NoteForm from './components/NoteForm';

class App extends Component {
  render() {
    return (
      <div>
        <h3>Welcome to Lambda Notes</h3>
        <Route exact path="/" render={props => (
          <Notes {...props} notes={this.props.notes} fetchNotes={this.props.fetchNotes} fetchingNotes={this.props.fetchingNotes} />
        )} />
        <Route path="/notes/add" render={props => (
          <NoteForm {...props} addNote={this.props.addNote} />
        )} />
        <Route path="/notes/:id" render={props => (
          <SingleNote {...props} note={this.props.note} />
        )}  />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    fetchingNotes: state.fetchingNotes,
    fetchingNote: state.fetchingNotes,
    notes: state.notes,
    note: state.note,
    error: state.error,
    updatingNote: state.updatingNote,
  }
}

export default withRouter(connect(mapStateToProps, actions)(App))
