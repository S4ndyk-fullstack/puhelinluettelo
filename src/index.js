import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = (props) => {
    const [persons, setPersons] = useState(props.persons)
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [search, setSearch] = useState('')

    return (
        <div>
            <Header title="Phonebook" />
            <Search search={search} setSearch={setSearch} />
            <Header title="Add a new" />
            <Form
                setPersons={setPersons} persons={persons}
                setNewName={setNewName} newName={newName}
                newNumber={newNumber} setNewNumber={setNewNumber}
            />
            <Header title="Numbers" />
            <Numbers persons={persons} search={search} />
        </div>
    )
}
const Form = ({ setPersons, persons, newName, setNewName, newNumber, setNewNumber }) => {
    const addNumber = (event) => {
        console.log("Adding ", newName, " to list");
        event.preventDefault()
        setPersons(persons.concat({
            id: Math.ceil(Math.random * 1000),
            name: newName,
            number: newNumber
        }))
        setNewName('')
        setNewNumber('')
    }
    return (
        <div>
            <form onSubmit={addNumber}>
                <div>
                    name: <input value={newName} onChange={(event) => setNewName(event.target.value)} />
                </div>

                <div>
                    number: <input value={newNumber} onChange={(event) => setNewNumber(event.target.value)} />
                </div>
                <button type="submit">add</button>
            </form>
        </div>
    )
}

const Search = ({search, setSearch}) => {
   return(
       <div>
           <form>
               filter shown with <input value={search} onChange={(event) => setSearch(event.target.value)}/>
           </form>
       </div>
   ) 
}


const Numbers = ({ persons, search }) => {
    return persons
    .filter(
        (person) => person.name.toLowerCase().includes(search)
        )
    .map(
        (person) => <Number key={person.id} person={person}/>
    )
}

const Number = ({person}) => <li>{person.name} {person.number}</li>


const Header = ({ title }) => <h2>{title}</h2>

const persons = [
    {
        id: 1,
        name: 'Arto Hellas',
        number: '050488114'
    },
    {
        id: 2,
        name: 'Matti Luukkainen',
        number: '040551821'
    }

]

ReactDOM.render(<App persons={persons} />, document.getElementById('root'));
 