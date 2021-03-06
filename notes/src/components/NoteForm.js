import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import fetchNotes from '../queries/fetchNotes';
import CurrentUser from '../queries/CurrentUser';

class NoteForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: '',
            content: '',
            tags: ''
        }
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
    }

    addNote = event => {
        event.preventDefault();
        let tagArray = [];
        if (Array.isArray(this.state.tags)){
            tagArray = this.state.tags;
        } else {
            tagArray = this.state.tags.split(' ').join('').split(',')
        }
        this.props.mutate({
            variables: {
                title: this.state.title,
                content: this.state.content,
                tags: tagArray,
                user: this.props.data.user
            },
            refetchQueries: [{ 
                query: fetchNotes,
                variables: {
                    awaitRefetchQueries: true,
                }
            }]
        }).then(() => this.props.history.push('/'));
        this.setState({
            title: '',
            content: '',
            tags: ''
        })
    }

    render() {
        return (
            <Form onSubmit={this.addNote} className="note-form">
                <FormGroup>
                    <Label for="title">Title</Label>
                    <Input type="text" name="title" id="title" onChange={this.handleChange} value={this.state.title} required></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="content">Note</Label>
                    <Input type="textarea" name="content" id="content" onChange={this.handleChange} value={this.state.content} required></Input>
                </FormGroup>
                <FormGroup>
                    <Label for="tags">Tags</Label>
                    <Input type="text" name="tags" id="tags" onChange={this.handleChange} value={this.state.tags} required></Input>
                </FormGroup>
                <Button>Add</Button>
            </Form>
        )
    }
}

const mutation = gql`
    mutation AddNote($title: String, $content: String, $tags: [String], $user: String) {
        addNote(title: $title, content: $content, tags: $tags, user: $user){
            title
            content
            tags
            user
        }
    }
`;

export default graphql(mutation)(graphql(CurrentUser)(NoteForm));