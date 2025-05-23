import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import MemoMenu from '../../../public/js/app/components/MemoMenu'
import mockWebContext from '../../mocks/mockWebContext'

jest.mock('@kth/om-kursen-ladok-client', () => ({
  LadokStatusCode: {
    Started: 'S2',
    Complete: 'S3',
  },
}))

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

const setup = () => render(<RenderMemoMenu userLang="en" />)

describe('User language: English. Component <RenderMemoMenu>', () => {
  test('renders headers h2', () => {
    setup()
    const allH2Headers = screen.getAllByRole('heading', { level: 2 })
    expect(allH2Headers.length).toBe(1)
    expect(allH2Headers[0]).toHaveTextContent('Välj kursomgång')
  })
  test('renders headers h3', () => {
    setup()
    const allH3Headers = screen.getAllByRole('heading', { level: 3 })
    expect(allH3Headers.length).toBe(1)
    expect(allH3Headers[0]).toHaveTextContent('Välj termin')
  })

  test('renders drop down menu and upload button', async () => {
    setup()
    const formControl = screen.getAllByRole('combobox')
    expect(formControl).toMatchInlineSnapshot(`
[
  <select
    aria-label="Välj termin"
    class="form-control"
  >
    <option
      style="display: none;"
      value="Välj termin"
    >
      Välj termin
    </option>
    <option
      value="20211"
    >
      VT 2021
    </option>
    <option
      value="20202"
    >
      HT 2020
    </option>
    <option
      value="20201"
    >
      VT 2020
    </option>
    <option
      value="20192"
    >
      HT 2019
    </option>
  </select>,
]
`)

    await userEvent.selectOptions(screen.getByRole('combobox', { name: /Välj termin/i }), '20201')
    const uploadBtnAfter = screen.getByText('Ladda upp')
    expect(uploadBtnAfter).toBeInTheDocument()
  })

  test('renders a cancel button', () => {
    setup()
    const label = screen.getByText('Avbryt')
    expect(label).toBeInTheDocument()
  })

  test('renders checkbox for course offering which does not have a published course data', async () => {
    setup()
    const select = screen.getByRole('combobox')
    fireEvent.change(select, { target: { value: '20192' } })

    const checkboxes = await screen.findAllByRole('checkbox')
    expect(checkboxes.length).toBe(2)
  })

  test('renders HT 2019 dropdown elements', () => {
    setup()
    const label = screen.getByText('HT 2019')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2021 dropdown elements', () => {
    setup()
    const label = screen.getByText('VT 2021')
    expect(label).toBeInTheDocument()
  })

  test('renders HT 2020 dropdown elements', () => {
    setup()
    const label = screen.getByText('HT 2020')
    expect(label).toBeInTheDocument()
  })

  test('renders VT 2020 dropdown elements', () => {
    setup()
    const label = screen.getByText('VT 2020')
    expect(label).toBeInTheDocument()
  })
})
