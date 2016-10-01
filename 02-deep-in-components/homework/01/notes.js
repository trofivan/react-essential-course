var Note = React.createClass({
    render: function() {
        var style = { backgroundColor: this.props.color };
        return (
            <div className="note" style={style}>
                <span className="delete-note" onClick={this.props.onDelete}> × </span>
                {this.props.children}
            </div>
        );
    }
});

var NoteEditor = React.createClass({
    getInitialState: function() {
        return {
            text: '',
            color: 'yellow'
        };
    },

    handleTextChange: function(event) {
        this.setState({ text: event.target.value });
    },

    handleColorChange: function(color) {
        this.setState({
            color: color
        });
    },

    handleNoteAdd: function() {
        var newNote = {
            text: this.state.text,
            color: this.state.color,
            id: Date.now()
        };

        this.props.onNoteAdd(newNote);
        this.setState({ text: '' });
    },

    render: function() {
        return (
            <div className="note-editor">
                <textarea
                    placeholder="Enter your note here..."
                    rows={5}
                    className="textarea"
                    value={this.state.text}
                    onChange={this.handleTextChange}
                />

                <NoteColor onColorChange={this.handleColorChange} />

                <button className="add-button" onClick={this.handleNoteAdd}>Add</button>
            </div>
        );
    }
});

var NoteColor = React.createClass({
    getDefaultProps: function() {
        return {
            colors: ['Tomato', 'Orange', 'Yellow', 'PaleGreen', 'SkyBlue', 'RoyalBlue', 'MediumOrchid']
        }
    },
    handleColorChange: function(event){
        this.props.onColorChange(event.target.value);
    },
    /* Выбрали цвет заметки */
    componentDidMount: function(){
        this.props.onColorChange(this.props.colors[2]);
    },
    render: function() {
        return(
            <div className='colors' onChange={this.handleColorChange}>
                {this.props.colors.map(function(color, index){
                    var style = {
                        backgroundColor: color
                    };
                    return (
                        <div>
                            <input
                                type='radio'
                                name='color'
                                value={color}
                                id={'r-'+color}
                            />
                            <label class='color' style={style} htmlFor={'r-'+color} />
                        </div>
                    );
                })}
            </div>
        );
    }
});

var NotesGrid = React.createClass({
    componentDidMount: function() {
        var grid = this.refs.grid;
        this.msnry = new Masonry( grid, {
            itemSelector: '.note',
            columnWidth: 200,
            gutter: 10,
            isFitWidth: true
        });
    },

    componentDidUpdate: function(prevProps) {
        if (this.props.notes.length !== prevProps.notes.length) {
            this.msnry.reloadItems();
            this.msnry.layout();
        }
    },

    render: function() {
        var onNoteDelete = this.props.onNoteDelete;

        return (
            <div className="notes-grid" ref="grid">
                {
                    this.props.notes.map(function(note){
                        return (
                            <Note
                                key={note.id}
                                onDelete={onNoteDelete.bind(null, note)}
                                color={note.color}>
                                {note.text}
                            </Note>
                        );
                    })
                }
            </div>
        );
    }
});

var NotesApp = React.createClass({
    getInitialState: function() {
        return {
            notes: []
        };
    },

    componentDidMount: function() {
        var localNotes = JSON.parse(localStorage.getItem('notes'));
        if (localNotes) {
            this.setState({ notes: localNotes });
        }
    },

    componentDidUpdate: function() {
        this._updateLocalStorage();
    },

    handleNoteDelete: function(note) {
        var noteId = note.id;
        var newNotes = this.state.notes.filter(function(note) {
            return note.id !== noteId;
        });
        this.setState({ notes: newNotes });
    },

    handleNoteAdd: function(newNote) {
        var newNotes = this.state.notes.slice();
        newNotes.unshift(newNote);
        this.setState({ notes: newNotes });
    },

    render: function() {
        return (
            <div className="notes-app">
                <h2 className="app-header">NotesApp</h2>
                <NoteEditor onNoteAdd={this.handleNoteAdd} />
                <NotesGrid notes={this.state.notes} onNoteDelete={this.handleNoteDelete} />
            </div>
        );
    },

    _updateLocalStorage: function() {
        var notes = JSON.stringify(this.state.notes);
        localStorage.setItem('notes', notes);
    }
});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount-point')
);
