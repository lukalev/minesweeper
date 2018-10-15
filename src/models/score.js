//model of firebase collection
export default (id, name, score, date) => {
    return {
        id: id,
        name: name,
        score: score,
        date: date
    }
}