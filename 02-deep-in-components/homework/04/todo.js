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
                    onClick={this.props.onToDoComplete}>
                        {this.props.taskText}
                </label>
                <button
                    className='destroy'
                    onClick={this.props.onToDoRemove}>✕</button>
            </li>
        );
    }
});

const ListToDo = React.createClass({
    render() {
        const onToDoComplete = this.props.onToDoComplete;
        const onToDoRemove = this.props.onToDoRemove;

        return (
            <ul className='list-todo'>
                {
                    this.props.tasks.map(task =>
                        <ToDo
                            taskID={task.id}
                            taskIsComplete={task.complete}
                            taskText={task.text}
                            onToDoComplete={onToDoComplete.bind(null, task)}
                            onToDoRemove={onToDoRemove.bind(null, task)}
                        />
                    )
                }
            </ul>
        );
    }
});

const FilterToDo = React.createClass({
    render() {
        let currentFilter = this.props.currentFilter;
        let btnText = this.props.currentButton.text;
        let btnStatus = this.props.currentButton.status;

        return (
            <li>
                <a
                    href={'#/'+btnStatus}
                    className={(currentFilter === btnStatus)?('active'):('')}
                    onClick={this.props.handleOnClick.bind(null, btnStatus)}>
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
                'status' : 'all',
                'text' : 'Все'
            },
            {
                'status' : 'active',
                'text' : 'Активные'
            },
            {
                'status' : 'completed',
                'text' : 'Закрытые'
            }
        ];

        return (
            <ul className='filters-todo'>
                {
                    FILTER_BUTTONS.map( currentButton =>
                        <FilterToDo
                            currentButton={currentButton}
                            currentFilter={this.props.currentFilter}
                            handleOnClick={this.props.onToDoFilter}
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
                onKeyPress={this.handleKeyPress} />
        );
    }
});

const ToDoApp = React.createClass({
    getInitialState(){
        return {
            'tasks': [],
            'filter': 'all'
        };
    },
    componentDidUpdate() {
        this._updateLocalStorage();
    },
    componentWillMount() {
        const tasks = localStorage.getItem('tasks');

        if(tasks) {
            this.setState({
                'tasks' : JSON.parse(tasks)
            });
        }
    },
    onToDoAdd(task) {
        let currentTasks = this.state.tasks.slice();

        if(task.text)
            currentTasks.unshift(task);

        this.setState({
            'tasks' : currentTasks
        });

    },
    onToDoFilter(filter) {
        this.setState({
            'filter': filter
        });
    },
    onToDoComplete(task) {
        let currentTasks = this.state.tasks.slice();

        currentTasks.forEach(elem => {
            if(elem.id === task.id)
                elem.complete = !task.complete;
        });

        this.setState({
            tasks: currentTasks
        });
    },
    onToDoRemove(task) {
        let newTasks = this.state.tasks.filter(el => {
            return el.id !== task.id;
        });

        this.setState({
            'tasks' : newTasks
        });
    },
    render() {
        return (
            <div id="todo-app">
                <NewToDo onToDoAdd={this.onToDoAdd}/>
                <FiltersToDo
                    onToDoFilter={this.onToDoFilter}
                    currentFilter={this.state.filter}
                />
                <ListToDo
                    onToDoComplete={this.onToDoComplete}
                    onToDoRemove={this.onToDoRemove}
                    tasks={this._getVisibleTasks(this.state.tasks, this.state.filter)} />
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
    <ToDoApp/>,
    document.getElementById('todo-list')
);
