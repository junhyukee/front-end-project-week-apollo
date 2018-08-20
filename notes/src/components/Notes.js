import React, { Component } from 'react'
import Note from './Note';
import { Input } from 'reactstrap';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: "none",
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,
    borderRadius: `4px`,

    // change background colour if dragging
    background: isDragging ? "#636e72" : "transparent",

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#b2bec3" : "#dfe6e9",
    padding: grid,
    width: `60%`,
    margin: `1rem auto`,
    borderRadius: `4px`
});

class Notes extends Component {
    constructor(props){
        super(props);
        this.state = {
            shownNotes: []
        }
    }

    componentDidMount = () => {
        this.props.fetchNotes();
        setTimeout(() => this.initializeData(), 500);
    }

    searchInput = (event) => {
        let searchTerm = event.target.value;
        this.setState(() => {
            return ({ shownNotes: this.props.notes.filter(note => note.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1)})
        });
    }

    initializeData = () => {
        this.setState({
            shownNotes: this.props.notes
        })
    }

    onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const shownNotes = reorder(
            this.state.shownNotes,
            result.source.index,
            result.destination.index
        );

        this.setState({
            shownNotes
        });
    }

    render() {
        if (this.props.fetchingNotes){
            return (<div></div>)
        }
        return (
            <div className="home">
                <Input type="text" onChange={this.searchInput} placeholder="Search" className="search-bar"/>
                <DragDropContext onDragEnd={this.onDragEnd}>
                    <Droppable droppableId="droppable" className="note-container">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {this.state.shownNotes.map((note, index) => (
                                    <Draggable key={note._id} draggableId={note._id} index={index}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                style={getItemStyle(
                                                    snapshot.isDragging,
                                                    provided.draggableProps.style
                                                )}
                                            >
                                                <Note id={note._id} title={note.title} content={note.textBody} tags={note.tags} /> 
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>

                {/* {this.state.shownNotes.map(note => {
                    return (
                        <div className="note" key={note._id}>
                            <Note id={note._id} title={note.title} content={note.textBody} tags={note.tags} /> 
                        </div>
                    )
                })} */}
            </div>
        )
    }
}

export default Notes;