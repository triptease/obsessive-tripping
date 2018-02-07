import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<App />, div)
})

describe('getCategoriesCounts', () => {
  it('returns an object with keys of all the categories in the given obsessions', () => {
    const result = App.getCategoriesCounts({
      abc: { id: 'abc', category: 'film' }
    })
    expect(Object.keys(result)).toEqual(['film'])

    const obsessions = {
      abc: { id: 'abc', category: 'book' },
      edf: { id: 'edf', category: 'book' },
      qwe: { id: 'qwe', category: 'film' },
      asd: { id: 'asd', category: 'podcast' },
      zxc: { id: 'zxc', category: 'book' },
      poi: { id: 'poi', category: 'film' }
    }
    const resultB = App.getCategoriesCounts(obsessions)
    expect(Object.keys(resultB)).toEqual(['book', 'film', 'podcast'])
  })

  it('returns the counts of the existing categories', () => {
    const result = App.getCategoriesCounts({
      abc: { id: 'abc', category: 'film' }
    })
    expect(result.film).toBe(1)

    const obsessions = {
      abc: { id: 'abc', category: 'book' },
      edf: { id: 'edf', category: 'book' },
      qwe: { id: 'qwe', category: 'film' },
      asd: { id: 'asd', category: 'podcast' },
      zxc: { id: 'zxc', category: 'book' },
      poi: { id: 'poi', category: 'film' }
    }
    const resultB = App.getCategoriesCounts(obsessions)
    expect(resultB.book).toBe(3)
    expect(resultB.film).toBe(2)
    expect(resultB.podcast).toBe(1)
  })
})
