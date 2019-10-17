import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react'
import personService from './personService'

const App = (props) => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')
    const [notification, setNotification] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        personService.getAll()
            .then(data => setPersons(data))
    }, [])

    const addOrUpdate = (event) => {
        event.preventDefault()
        const foundPerson = persons.find(person => person.name === newName)
        if (foundPerson) {
            if (window.confirm(`${foundPerson.name} is already added to phonebook, replace the old number with a new one?`)) {
                return updatePerson(foundPerson)
            }
        }
        const randomId = Math.floor(Math.random() * 10000)
        const newPerson = {
            name: newName,
            number: newNumber,
            id: randomId
        }
        return addPerson(newPerson)
    }

    const addPerson = (newPerson) => {
        personService.create(newPerson)
            .then(addedPerson => { 
                setPersons(persons.concat(addedPerson))
                setNotification(`Added ${addedPerson.name}`)
                setTimeout(() => setNotification(null), 3000)
            })
            .catch((err) => {
                setError(`Failed to add ${newPerson.name} due to ${err}`)
                setTimeout(() => setError(null), 3000)
            })
        setNewName('')
        setNewNumber('')
    }

    const removePerson = (person) => {
        if (window.confirm(`Delete ${person.name}?`)) {
            personService.remove(person.id)
                .then(() => {
                    setPersons(persons.filter(nextPerson => nextPerson.id !== person.id))
                    setNotification(`Removed ${person.name}`)
                    setTimeout(() => setNotification(null), 3000)
                })
                .catch((err) => {
                    setError(`Failed to remove ${person.name} due to ${err}`)
                    setTimeout(() => setError(null), 3000)
                })
        }
    }

    const updatePerson = (person) => {
        const newPerson = {
            ...person,
            name: newName,
            number: newNumber
        }
        personService.update(person.id, newPerson)
            .then(returnedPerson => {
                setPersons(persons.map(nextPerson => nextPerson.id === person.id ? returnedPerson : nextPerson))
                setNotification(`Updated ${returnedPerson.name}`)
                setTimeout(() => setNotification(null), 3000)
            })
            .catch((err) => {
                setError(`Failed to replace ${person.name} due to ${err}`)
                setTimeout(() => setError(null), 3000)
            })
        setNewName('')
        setNewNumber('')
    }

    return (
        <div>
            <Header title='Phonebook' />
            <Notification message={notification} />
            <Error message={error} />
            <Input text='filter shown with ' value={search} set={setSearch} />
            <Header title='Add a new' />
            <Form
                addOrUpdate={addOrUpdate}
                setNewName={setNewName} newName={newName}
                newNumber={newNumber} setNewNumber={setNewNumber}
            />
            <Header title='Numbers' />
            <Numbers persons={persons} search={search} removePerson={removePerson} />
        </div>
    )
}

const Form = ({ addOrUpdate, newName, setNewName, newNumber, setNewNumber }) => {
    return (
        <div>
            <form onSubmit={addOrUpdate}>
                <Input text='name: ' value={newName} set={setNewName} />
                <Input text='number: ' value={newNumber} set={setNewNumber} />
                <button type="submit">add</button>
            </form>
        </div>
    )
}

const Input = ({ text, value, set }) => {
    return (
        <div>
            {text} <input value={value} onChange={event => set(event.target.value)} />
        </div>
    )
}

const Numbers = ({ removePerson, persons, search }) => {
    const filtered = persons.filter((person) => person.name.toLowerCase().includes(search))
    return (
        <ul>
            {filtered.map(person => <Number key={person.id} person={person} removePerson={removePerson} />)}
        </ul>
    )
}

const Number = ({ person, removePerson }) => {
    return (
        <li>
            {person.name} {person.number}
            <button onClick={() => removePerson(person)}>remove</button>
        </li>
    )
}

const Notification = ({ message }) => {
    const style = {
        color: 'green',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    if (message === null) return null
    return (
        <div style={style}>
            {message}
        </div>
    )
}

const Error = ({ message }) => {
    const style = {
        color: 'red',
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    }

    if (message === null) return null
    return (
        <div style={style}>
            {message}
        </div>
    )
}


const Header = ({ title }) => <h2>{title}</h2>

ReactDOM.render(<App />, document.getElementById('root'));