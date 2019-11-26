import React from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { updateUsername } from '../dux/reducer'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Swal from 'sweetalert2'
import { Content } from '../css/styledComponents'

const SideBar = styled.div`
height: 100vh
background: lightgray
width: 300px
display: flex
flex-direction: column
align-items: center
justify-content: space-between`

const StyledLink = styled(Link)`
    text-decoration: none;
    color: black
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
`

function Sidebar(props) {
    const logout = () => {
        axios.delete('/auth/logout').then(res => {
            Swal.fire(
                res.data.message,
                'log out successful',
                'success')
            props.updateUsername('')
        })
        localStorage.clear()
    }
    ///////
const myList = async () => {
    await props.allListsFalse()
    props.getProjects()
}

    const allLists = async ()=> {
        // console.log('all lists')
       await props.allListsTrue()
       props.getProjects()
    }
    return (
        <SideBar>

            <div>

            <Content
            onClick={()=> myList()}
            >{localStorage.getItem('username')}</Content>


            <Content
            onClick={()=>allLists()}
            >all lists</Content>



            <StyledLink to='/'>
            <Content
            onClick={()=> logout()}
            >log out</Content>
            </StyledLink>
            </div>


            
        userID: {localStorage.getItem('userID')}
           

        </SideBar>
    )
}

function mapStateToProps(reduxState){
    return reduxState
}

export default connect(mapStateToProps, {updateUsername})(Sidebar)