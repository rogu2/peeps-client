import React, { useReducer } from 'react'
import axios from 'axios'
import ContactContext from './contactContext'
import contactReducer from './contactReducer'
import {
    ADD_CONTACT,
    GET_CONTACTS,
    CLEAR_CONTACTS,
    DELETE_CONTACT,
    SET_CURRENT,
    CLEAR_CURRENT,
    UPDATE_CONTACT,
    FILTER_CONTACTS,
    CLEAR_FILTER,
    CONTACT_ERROR
} from '../types'

const ContactState = props => {
    const initialState = {
        contacts: null,
        current: null,
        filtered: null
    }

    const [state, dispatch] = useReducer(contactReducer, initialState)

    //  Get Contacts
    const getContacts = async () => {
        try {
            const res = await axios.get('/api/contacts')

            dispatch({ 
                type: GET_CONTACTS, 
                payload: res.data 
            })
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.message 
            })
        }
    }

    // Add Contact
    const addContact = async contact => {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        try {
            const res = await axios.post('/api/contacts', contact, config)

            dispatch({ 
                type: ADD_CONTACT, 
                payload: res.data 
            })
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.message 
            })
        }
    }
    // Delete Contact
    const deleteContact = async _id => {
        try {
            await axios.delete(`/api/contacts/${_id}`)

            dispatch({ 
                type: DELETE_CONTACT, 
                payload: _id
            })
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.message 
            })
        }
    }

    // Update Contact
    const updateContact = async contact => {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        }
        try {
            const { _id } = contact
            const res = await axios.patch(`/api/contacts/${_id}`, contact, config)

            dispatch({ 
                type: UPDATE_CONTACT, 
                payload: res.data 
            })
        } catch (err) {
            dispatch({ 
                type: CONTACT_ERROR,
                payload: err.response.message 
            })
        }
    }

    // Clear Contacts
    const clearContacts = () => {
        dispatch({ type: CLEAR_CONTACTS })
    }

    // Set Current Contact
    const setCurrent = contact => {
        dispatch({ type: SET_CURRENT, payload: contact })
    }

    // Clear Current Contact
    const clearCurrent = () => {
        dispatch({ type: CLEAR_CURRENT })
    }
    
    // Filter Contacts
    const filterContacts = text => {
        dispatch({ type: FILTER_CONTACTS, payload: text })
    }

    // Clear Filter
    const clearFilter = () => {
        dispatch({ type: CLEAR_FILTER })
    }

    return (
        <ContactContext.Provider
        value={{
            contacts: state.contacts,
            current: state.current,
            filtered: state.filtered,
            error: state.error,
            getContacts,
            addContact,
            deleteContact,
            updateContact,
            filterContacts,
            clearFilter,
            setCurrent,
            clearCurrent,
            clearContacts
        }}>
            { props.children }
        </ContactContext.Provider>
    )
}

export default ContactState