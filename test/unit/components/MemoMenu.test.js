import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import i18n from '../../../i18n'
import { StaticRouter } from 'react-router-dom/server'
import MemoMenu from '../../../public/js/app/components/MemoMenu'
import mockRouterStore from '../../mocks/mockRouterStore'
const { getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText } = screen

const RenderMemoMenu = ({ userLang = 'en', status = 'new', ...rest }) => {
  const rS = mockRouterStore(userLang, status)
  return (
    <MemoMenu
      routerStore={rS}
      {...rest}
      semesterList={rS.semesters}
      roundList={rS.roundData}
      activeSemester="20192"
      firstVisit={true}
    />
  )
}

describe('User language: English. Component <RenderMemoMenu>', () => {
  beforeEach(() => {
    render(<RenderMemoMenu userLang="en" />)
  })
  test('renders a course development page', done => {
    done()
  })
  test('renders headers h2', () => {
    const allH3Headers = getAllByRole('heading', { level: 2 })
    expect(allH3Headers.length).toBe(1)
    expect(allH3Headers[0]).toHaveTextContent('Välj kursomgång')
  })
  test('renders headers h3', () => {
    const allH3Headers = getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(1)
    expect(allH3Headers[0]).toHaveTextContent('Välj termin')
  })

  test('renders buttons. English.', () => {
    const buttons = getAllByRole('button')
    expect(buttons.length).toBe(3)
    expect(buttons[0]).toHaveTextContent('')
    expect(buttons[1]).toHaveTextContent('Välj termin')
    expect(buttons[2]).toHaveTextContent('Avbryt')
  })

  xtest('renders checkbox for course offering which does not have a published course data', () => {
    const checkboxes = getAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)
  })

  test('renders HT 2019 dropdown elements', () => {
    const label = screen.getByText('HT 2019')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2021 dropdown elements', () => {
    const label = screen.getByText('VT 2021')
    expect(label).toBeInTheDocument()
  })

  test('renders HT 2020 dropdown elements', () => {
    const label = screen.getByText('HT 2020')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2020 dropdown elements', () => {
    const label = screen.getByText('VT 2020')
    expect(label).toBeInTheDocument()
  })
})
