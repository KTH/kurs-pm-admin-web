import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import i18n from '../../../i18n'
import { StaticRouter } from 'react-router-dom/server'
import MemoMenu from '../../../public/js/app/components/MemoMenu'
import mockWebContext from '../../mocks/mockWebContext'
import userEvent from '@testing-library/user-event'

const { getByRole, getAllByRole, getAllByTestId, getAllByText, getByTestId, getByText, findAllByRole } = screen

const RenderMemoMenu = ({ userLang = 'en', status = 'new', ...rest }) => {
  const rS = mockWebContext(userLang, status)
  return (
    <MemoMenu
      context={rS}
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

  test('renders drop down menu and upload button', async () => {
    const formControl = getAllByRole('combobox')
    expect(formControl).toMatchInlineSnapshot(`
      [
        <select
          aria-label="Välj termin"
          class="form-control"
          id="semesterDropdownControl"
        >
          <option
            disabled=""
            selected=""
            value="Välj termin"
          >
            Välj termin
          </option>
          <option
            id="20211"
            value="20211"
          >
            VT  
                              2021
          </option>
          <option
            id="20202"
            value="20202"
          >
            HT  
                              2020
          </option>
          <option
            id="20201"
            value="20201"
          >
            VT  
                              2020
          </option>
          <option
            id="20192"
            value="20192"
          >
            HT  
                              2019
          </option>
        </select>,
      ]
    `)

    await userEvent.selectOptions(getByRole('combobox', { name: /Välj termin/i }), '20201')
    const uploadBtnAfter = getByText('Ladda upp')
    expect(uploadBtnAfter).toBeInTheDocument()
  })

  test('renders a cancel button', () => {
    const label = getByText('Avbryt')
    expect(label).toBeInTheDocument()
  })

  test('renders checkbox for course offering which does not have a published course data', async () => {
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '20192' } })

    const checkboxes = await findAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)
  })

  test('renders HT 2019 dropdown elements', () => {
    const label = getByText('HT 2019')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2021 dropdown elements', () => {
    const label = getByText('VT 2021')
    expect(label).toBeInTheDocument()
  })

  test('renders HT 2020 dropdown elements', () => {
    const label = getByText('HT 2020')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2020 dropdown elements', () => {
    const label = getByText('VT 2020')
    expect(label).toBeInTheDocument()
  })
})
