import React from 'react'
import { Provider } from 'mobx-react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import i18n from '../../../i18n'
import { StaticRouter } from 'react-router'
import AdminPage from '../../../public/js/app/views/AdminPage'
import mockRouterStore from '../../mocks/mockRouterStore'
const { getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText } = screen

const RenderAdminPage = ({ userLang = 'en', status = 'new', ...rest }) => {
  const rS = mockRouterStore(userLang, status)
  return (
    <StaticRouter>
      <Provider routerStore={rS}>
        <AdminPage
          semesterList={rS.semesters}
          firstVisit={true}
          roundList={rS.roundData}
          activeSemester="20192"
          {...rest}
        />
      </Provider>
    </StaticRouter>
  )
}

describe('User language: English. Component <AdminPage> with status and progress "new"', () => {
  beforeEach(() => {
    render(<RenderAdminPage userLang="en" status="new" />)
  })
  test('renders a course development page', done => {
    done()
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
