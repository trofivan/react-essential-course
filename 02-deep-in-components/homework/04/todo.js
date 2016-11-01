const ToDo = React.createClass({
    render() {
        return (
            <li>
                <input
                    id={this.props.taskID}
                    className='checkbox'
                    type='checkbox'
                    checked={(this.props.taskIsComplete)?(true):(false)}
                />

                <label
                    htmlFor={this.props.taskID}
                    className={(this.props.taskIsComplete)?('success'):('')}
                    onClick={this.props.onToDoComplete}
                >
                    {this.props.taskText}
                </label>

                <button className='destroy' onClick={this.props.onToDoRemove}>
                    ✕
                </button>
            </li>
        );
    }
});

const ListToDo = React.createClass({
    render() {
        const handleToDoComplete = this.props.onToDoComplete;
        const handleToDoRemove = this.props.onToDoRemove;

        return (
            <ul className='list-todo'>
                {
                    this.props.tasks.map(task =>
                        <ToDo
                            taskID={task.id}
                            taskIsComplete={task.complete}
                            taskText={task.text}
                            onToDoComplete={handleToDoComplete.bind(null, task)}
                            onToDoRemove={handleToDoRemove.bind(null, task)}
                        />
                    )
                }
            </ul>
        );
    }
});

const FilterToDo = React.createClass({
    render() {
        const currentFilter = this.props.currentFilter;
        const btnText = this.props.currentButton.text;
        const btnStatus = this.props.currentButton.status;

        return (
            <li>
                <a
                    href={'#/'+btnStatus}
                    className={(currentFilter === btnStatus)?('active'):('')}
                    onClick={this.props.onClick.bind(null, btnStatus)}
                >
                    {btnText}
                </a>
            </li>
        );
    }
});

const FiltersToDo = React.createClass({
    render() {
        const FILTER_BUTTONS = [
            {
                status : 'all',
                text : 'Все'
            },
            {
                status : 'active',
                text : 'Активные'
            },
            {
                status : 'completed',
                text : 'Закрытые'
            }
        ];

        return (
            <ul className='filters-todo'>
                {
                    FILTER_BUTTONS.map( currentButton =>
                        <FilterToDo
                            currentButton={currentButton}
                            currentFilter={this.props.currentFilter}
                            onClick={this.props.onToDoFilter}
                        />
                    )
                }
            </ul>
        );
    }
});

const NewToDo = React.createClass({
    handleKeyPress(e) {
        if(e.key === 'Enter') {
            const newTask = {
                id : Date.now(),
                text : e.target.value,
                complete : false
            };
            this.props.onToDoAdd(newTask);
            e.target.value = '';
        }
    },
    render() {
        return (
            <input
                type='text'
                className='new-todo'
                placeholder='Что хотим сделать?'
                onKeyPress={this.handleKeyPress}
            />
        );
    }
});

const ToDoApp = React.createClass({
    getInitialState(){
        return {
            tasks: [],
            filter: 'all'
        };
    },
    componentDidUpdate() {
        this._updateLocalStorage();
    },
    componentWillMount() {
        const tasks = localStorage.getItem('tasks');

        if(tasks) {
            this.setState({
                tasks : JSON.parse(tasks)
            });
        }
    },
    handleToDoAdd(task) {
        let currentTasks = this.state.tasks.slice();

        if(task.text)
            currentTasks.unshift(task);

        this.setState({
            tasks : currentTasks
        });

    },
    handleToDoFilter(filter) {
        this.setState({
            filter
        });
    },
    handleToDoComplete(task) {
        let tasks = this.state.tasks.slice();

        tasks.map(elem => {
            if(elem.id === task.id)
                elem.complete = !elem.complete;
        });

        this.setState({
            tasks: tasks
        });
    },
    handleToDoRemove(task) {
        const newTasks = this.state.tasks.filter( el => el.id !== task.id );

        this.setState({
            tasks : newTasks
        });
    },
    render() {
        return (
            <div id="todo-app">
                <NewToDo onToDoAdd={this.handleToDoAdd} />
                <FiltersToDo
                    currentFilter={this.state.filter}
                    onToDoFilter={this.handleToDoFilter}
                />
                <ListToDo
                    tasks={this._getVisibleTasks(this.state.tasks, this.state.filter)}
                    onToDoComplete={this.handleToDoComplete}
                    onToDoRemove={this.handleToDoRemove}
                />
            </div>
        );
    },
    _getVisibleTasks(tasks, filter) {
        if (filter === 'active')
            return tasks.filter( task => task.complete === false );

        if (filter === 'completed')
            return tasks.filter( task => task.complete === true );

        return tasks;
    },
    _updateLocalStorage() {
        const tasks = JSON.stringify(this.state.tasks);
        localStorage.setItem('tasks', tasks);
    }
});

ReactDOM.render(
    <ToDoApp />,
    document.getElementById('todo-list')
);
