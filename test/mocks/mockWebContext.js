import { addClientFunctionsToWebContext } from '../../public/js/app/client-context/addClientFunctionsToWebContext'

const storeFunctions = addClientFunctionsToWebContext()
const usedRounds = {
  applicationCodes: ['2'],
  roundsApplicationCodeWithWebVersion: {},
  memoList: [
    {
      courseMemoFileName: 'memo-EF1111HT2019_2.pdf',
      ugKeys: ['EF1111.examiner', 'EF1111.20192.2.courseresponsible'],
      user: 'elenara',
    },
  ],
}
const mockWebContext = () => {
  const routerWithData = {
    ...storeFunctions,
    language: 1,
    courseData: { courseCode: 'EF1111', gradeScale: { PF: 'P, F' }, semesterObjectList: {} },
    courseTitle: { name: 'Project in Plasma Physics', credits: '9.0' },
    browserConfig: {
      env: 'dev',
      hostUrl: 'https://localhost:3000',
      port: 3000,
      proxyPrefixPath: { uri: '/kursinfoadmin/pm' },
      storageUri: 'https://kursinfostoragestage/memo-blob-container/',
      useSsl: false,
    },
    usedRounds,
    semesters: [{ term: '20211' }, { term: '20202' }, { term: '20201' }, { term: '20192' }],
    roundData: {
      20192: [
        {
          endDate: '2019-10-25',
          canBeAccessedByUser: true,
          ladokUID: 'd',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2019-08-26',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2020-01-14',
          canBeAccessedByUser: true,
          ladokUID: '6413t1tt685',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2019-10-28',
          targetGroup: [],
          state: 'APPROVED',
        },
      ],
      20201: [
        {
          endDate: '2020-03-14',
          canBeAccessedByUser: true,
          ladokUID: 'ca29ft7a3',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2020-01-15',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2020-06-01',
          canBeAccessedByUser: true,
          ladokUID: 'c38bc898-f2f4-11e8-9614-d09e533d4323',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2020-03-16',
          targetGroup: [],
          state: 'APPROVED',
        },
      ],
      20202: [
        {
          endDate: '2020-10-23',
          canBeAccessedByUser: true,
          ladokUID: '3,f-,',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2020-08-24',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2021-01-15',
          canBeAccessedByUser: true,
          ladokUID: '208f6ed8-36b6-11ea-b8cf-f5b51a134413',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2020-10-26',
          targetGroup: [],
          state: 'APPROVED',
        },
      ],
      20211: [
        {
          endDate: '2021-03-19',
          canBeAccessedByUser: true,
          ladokUID: 'c1217dba-3612-11ea-b8cf-f5b51a134413',
          language: 'English',
          applicationCode: '2',
          shortName: '',
          startDate: '2021-01-18',
          targetGroup: [],
          state: 'APPROVED',
        },
        {
          endDate: '2021-06-08',
          canBeAccessedByUser: true,
          ladokUID: 'b5ah3989f-36k13',
          language: 'English',
          applicationCode: '1',
          shortName: '',
          startDate: '2021-03-22',
          state: 'APPROVED',
        },
      ],
    },
    tempData: null,
    statistics: { examinationGrade: 99, endDate: null, registeredStudents: 10 },
    getUsedRounds() {
      return Promise.resolve(usedRounds)
    },
  }

  return routerWithData
}

export default mockWebContext
