import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { DragDropContext, Droppable } from 'react-beautiful-dnd'
import Task from './Task'
import TrashCan from './TrashCan'
// import ToggleSwitch from './ToggleSwitch'

const Container = styled.div`
border: 1px solid lightgray
border-radius: 5px
margin: 50px
width: 500px
background: ${props => ((props.sessionUser === props.projectUser) ? 'white' : 'lightgray')}`

const Title = styled.h3`
font-family: sans-serif
margin: 3px
font-size: 3rem
font-weight: 200`

const TaskList = styled.div`
font-weight: 200
background: ${props => ((props.sessionUser === props.projectUser) ? 'white' : 'lightgray')}`

const Add = styled.div`
height: 90px
width: 90px
background: black
border-radius: 50%
color: white
display: flex
align-items: center
justify-content: center
font-size: 5.5rem
font-weight: 200
padding-bottom: 20px
box-sizing: border-box
&:hover {
    height: 135px
    width: 135px
    font-size: 7rem
}`

const Buttons = styled.div`
display: flex
justify-content: space-evenly
align-items: center
margin: 8px
width: 40%`

const Content = styled.div`
font-size: 1.5rem
margin-top: 25px`


class Project extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            projectUser: '',
            tasks: [], 
            taskOrder: []
        }
        this.getTasks = this.getTasks.bind(this)
    }

    componentDidMount() {
        this.getProjectUser()
        this.getTasks()
    }

    getProjectUser() {
        axios.get(`/api/project/${this.props.project.project_id}`)
            .then(res => {
                this.setState({
                    projectUser: res.data[0].username
                })
            })
    }
    getTasks() {
        const userID = this.props.project.project_id
        axios.get(`/api/tasks/${userID}`)
            .then(res => {
                this.setState({
                    tasks: res.data
                })
            })
    }

    //ON DRAG END--------------------------------------------------------------------------
    onDragEnd = result => {
        const { destination, source, draggableID } = result
        //NO ACTION REQUIRED: no destination or dropped in same location
        if (!destination) {
            return
        }
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return
        }
        ////TRASH CAN: AXIOS DELETE
        if (
            destination.droppableId === 'trash-can'
        ) {
            const id = this.state.tasks[source.index].task_id
            axios.delete(`/api/task/${id}`).then(res => {

                this.getTasks()
            })
        }

        ////////////REORDER TASKID ARRAY
        const { taskOrder } = this.state
        const newTaskOrder = Array.from(taskOrder)

        //move task_id from old index to new index
        newTaskOrder.splice(source.index, 1)
        newTaskOrder.splice(destination.index, 0, draggableID)

        //set new state
        this.setState({
            taskOrder: newTaskOrder
        })


        //     const newTaskOrder = Array.from(this.state.taskOrder)
        //     const sourceValue = newTaskOrder.splice(source.index, 1)
        //     newTaskOrder.splice(destination.index, 0, sourceValue[0])

        //     ///need to fix (mutating state)?
        //     this.state.taskOrder = newTaskOrder

        //     // this.setState({
        //     //     taskOrder : newTaskOrder
        //     // })

        //     const newTasks = Array.from(this.state.tasks)


        //     for (let i = 0; i < this.state.taskOrder.length; i++) {
        //         newTasks[i].droppable_id = this.state.taskOrder[i]
        //     }
        // }
    }

    //ADD BUTTON METHOD--------------------------------------------------------------------------
    addButton() {
        const id = localStorage.getItem('userID')

        axios.post('/api/tasks', [id]).then(res => {
            this.setState({
                tasks: res.data
            })
            this.getTasks()
        })
    }

    render() {
        // console.log(this.props.project)
        const { tasks } = this.state
        return (
            <DragDropContext
                onDragEnd={this.onDragEnd}
            >

                <Droppable droppableId={this.props.project.project_id.toString()}>
                    {(provided, snapshot) => (
                        <Container
                            sessionUser={localStorage.getItem('username')}
                            projectUser={this.state.projectUser}
                        >

                            {/* {(localStorage.getItem('username') === this.state.projectUser) &&
                                <ToggleSwitch />} */}


                            <Content>{this.state.projectUser}</Content>

                            <Title>{this.props.project.title}</Title>

                            <TaskList
                                sessionUser={localStorage.getItem('username')}
                                projectUser={this.state.projectUser}
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                isDraggingOver={snapshot.isDraggingOver}
                            >

                                {tasks.map((task, index) => <Task key={task.task_id}
                                    task={task} index={index} tasks={tasks} getTasks={this.getTasks}
                                    projectUser={this.state.projectUser} />)}
                                {provided.placeholder}
                            </TaskList>

                            {(localStorage.getItem('username') === this.state.projectUser) &&
                                <div className="test">
                                    <Buttons>
                                        <Add
                                            onClick={() => this.addButton()}
                                        >+</Add>
                                    </Buttons>

                                    <TrashCan />
                                </div>}

                        </Container>
                    )}
                </Droppable>
            </DragDropContext>
        )
    }
}

function mapStateToProps(reduxState) {
    return reduxState
}

export default connect(mapStateToProps)(Project)