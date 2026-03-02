import React, { useState, useEffect } from 'react'
import Filter from './Filter'
import Person from './Person'
import Persons from './Persons'
import personService from './services/service'
import Notification from './Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
}

  const removePerson = (id) => {
    const person = persons.find(p => p.id === id)

    if (!window.confirm(`Delete ${person.name}?`)) {
      return
  }

    personService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
        showNotification(`'${person.name}' removed successfully`)
      })
      .catch(error => {
       showNotification(
          `Information of '${person.name}' has already been removed from server`,
          'error'
        )
        setPersons(persons.filter(p => p.id !== id))
    })

    return
}
console.log(notification)

  const addPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(
      person => person.name === newName
    )

    if (existingPerson) {
      if (existingPerson.number === newNumber) {
        alert(`${newName} is already added to phonebook with the same number`)
        return
      }

      const confirmUpdate = window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one?`
      )      

    if (confirmUpdate) {
      const updatedPerson = {
        ...existingPerson,
        number: newNumber
      }
        showNotification(
          `'${newName}' number updated sucessfully`
        )

      personService
        .update(existingPerson.id, updatedPerson)
        .then(response => {
          setPersons(
            persons.map(p =>
              p.id !== existingPerson.id ? p : response.data
            )
          )
          setNewName('')
          setNewNumber('')
          showNotification(`'${newName}' number updated succesfully`)
        })
        .catch(error => {
          showNotification(
            `Information of '${existingPerson.name}' has already been removed from server`,
            'error'
          )
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
    }
    return
  }

    const personObject = {
      name: newName,
      number: newNumber
    }

  personService
    .create(personObject)
    .then(response => {
      setPersons(persons.concat(response.data))
      setNewName('')
      setNewNumber('')
      showNotification(`'${newName}' has been added to phonebook`)
  })
    .catch(error => {
      showNotification(
        error.response?.data?.error || 'Failed to add person',
        'error'
    )
  })

}

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification} />

      <Filter
        filter={filter}
        handleFilterChange={(e) => setFilter(e.target.value)}
      />

      <h2>Add a new</h2>
      <Person
        addPerson={addPerson}
        newName={newName}
        handleNameChange={(e) => setNewName(e.target.value)}
        newNumber={newNumber}
        handleNumberChange={(e) => setNewNumber(e.target.value)}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} removePerson={removePerson} />
    </div>
  )
}

export default App