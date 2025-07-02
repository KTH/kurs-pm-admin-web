# Welcome to kurs-pm-admin-web

![Prerequisite](https://img.shields.io/badge/node-18-blue.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

## Introduction

The course information project (KIP) is an initiative at KTH that was launched in 2018 to improve the quality and availability of information about KTH:s courses. The background to the project is, among other things, that it was difficult for the student to find information about the courses and even more difficult to compare information about several courses. The reason for the problems is scattered course information in several places and that there is no uniformity or assigned places for the course information. The project takes measures to consolidate course information into two locations and to present the information in a manner that is uniform for KTH. The student should find the right information about the course, depending on their needs. The result of the project is a public course site where the correct course information is collected and presented uniformly. Also, a tool is developed for teachers to enter and publish course information. Eventually, this will lead to the student making better decisions based on their needs, and it will also reduce the burden on teachers and administration regarding questions and support for the student.

**Kurs-pm-admin-web** is a microservice with an administration tool for teachers to upload a course memo in a **.pdf** format. It saves pdf to a blob storage directly, while information about which course offering it belongs to and other metadata are send to `kurs-pm-api` which later saves it to the common with `kurs-pm-data-api`database.

### 🏠 [Homepage](https://github.com/KTH/kurs-pm-admin-web)

## Overview

Firstly, the app has only one function. It is to upload a course memo pdf file to a blob storage and send data about it to `kurs-pm-api`.
Later this files can be found on public pages 'About course memo' served by `kurs-pm-web` and for a short time on pages served by `kursinfo-web`.
User can choose several course offerings and upload the same course memo file. It will be upload once in blob storage while in a database data about file and course offering will be saved per course offering. User can delete uploaded course memo or replace by a new one. The history of uploaded course-memos will be saved in api data.

The app consists of one page which is used to upload a new memo or to replace a published one. To do it user will go through three step:

- Choose a course offering(s), upload a pdf file, review it and publish it.

```
localhost:3000/kursinfoadmin/pm/:courseCode
```

### API:s

Application is fetching data from LADOK for:

- Course title
- Course offerings which are/were active for this course

Application is fetching data from KURS-PM-API for:

- Fetch course offerings which have a published course memo to sort per termin and filter course offerings fetched from LADOK.

- Fetch information about course memo file and course offering it saved for if user want to replace a published course memo file

- [https://github.com/KTH/kurs-pm-api](https://github.com/KTH/kurs-pm-api)

### Related projects

- [https://github.com/KTH/kursinfo-web](https://github.com/KTH/kursinfo-web)
- [https://github.com/KTH/kurs-pm-web](https://github.com/KTH/kurs-pm-web)
- [https://github.com/KTH/kurs-pm-api](https://github.com/KTH/kurs-pm-api)

We must try to make changes that affect the template projects in the template projects themselves.

- [https://github.com/KTH/node-web](https://github.com/KTH/node-web)

## Prerequisites

- node 18

Because OICD library is compatible only with node 12.0.0 or > 14.2.0

### Blob storage. Generate Shared access signature

- blob container (STORAGE_CONTAINER_NAME) `memo-blob-container`
- Allowed permissions: _Read, Write, Delete, Create_

While images uploads directly to a blob container located in a cloud in the storage account, f.e., `kursinfostoragestage`, the name of uploaded image will be saved in `kurs-pm-api`.
To connect to blob storage, the Shared access signature is used to limit what can be done by using this signature, f.e., only read, or write and which services. In stage environment keys were generated on base of key2.
For each service generated a separate Shared access signature and saved(f.e., SAS-REF-blob-service-sas-url-kurs-pm-admin-web) in standard key vault.

It requires package `"@azure/storage-blob": "^12.2.1"`. Further to parse a file between client and server, you need to have npm package `body-parser`. More details in `server/blobStorage.js`.

#### Blob storage. Generate Shared access signature

To generate it, go to a storage account, f.e., `kursinfostoragestage`, choose Shared Access signature and choose:

- Allowed services: _Blob_
- Allowed resource types: _Object_
- Allowed permissions: _Read, Write, Delete, Create_
- Start and expiry date/time
- HTTPS only
- Signing key: key1 or key2

After a generation of a key, copy **Blob service SAS URL** and save it in a standard key vault and set **Expiration Date**.
Later you will use it as a _BLOB_SERVICE_SAS_URL_ in secrets together with a name of blob container STORAGE_CONTAINER_NAME

### Secrets for Development

Secrets during local development are stored in a gitignored `.env` file (`env.in` can be used as template for your `.env` file). More details about environment variable setup and secrets can be found in [confluence](https://confluence.sys.kth.se/confluence/x/OYKBDQ).

### Install

```sh
npm install

```

You might need to install as well:

```sh
npm install cross-env
npm install concurrently
```

- `mini-css-extract-plugin` requires installation by `yarn` therefore it's added in `postinstall` step

### Usage

Start the service on [http://localhost:3000/kursinfoadmin/pm/:courseCode](http://localhost:3000/kursinfoadmin/pm/:courseCode).

```sh
npm run start-dev
```

### Debug in Visual Studio Code

It's possible to use debugging options available in Visual Studio Code
Add a file `launch.json` to `.vscode` directory :

- _Microsoft_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kurs-pm-admin-web",
      "program": "${workspaceFolder}\\app.js",
      "envFile": "${workspaceFolder}\\.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

- _Mac, Unix and so on_

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug kurs-pm-admin-web",
      "program": "${workspaceFolder}/app.js",
      "envFile": "${workspaceFolder}/.env",
      "env": {
        "NODE_ENV": "development"
      }
    }
  ]
}
```

## Run tests

```sh
npm run test
```

## Use 🐳

`API_URI` in `docker-compose.yml` is configured for a local kurs-pm-api, and might as well be changed to kurs-pm-api in ref.

```sh
docker-compose up
```

## Author

👤 **KTH**

- Website: https://kth.github.io/
- Github: [@KTH](https://github.com/KTH)
