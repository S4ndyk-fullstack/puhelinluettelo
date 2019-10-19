import axios from 'axios'

const url = '/api/persons'

const getAll = () => {
    const req = axios.get(url)
    return req.then(res => res.data)
}

const create = (person) => {
    const req = axios.post(url, person)
    return req.then(res => res.data)
}

const remove = (id) => {
    const req = axios.delete(`${url}/${id}`)
    return req.then(res => res.data)
}

const update = (id, newperson)  => {
    const req = axios.put(`${url}/${id}`, newperson)
    return req.then(res => res.data)
}

export default {getAll, create, remove, update}