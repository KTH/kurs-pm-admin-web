'use strict'

import { createInterfaceClass } from 'component-registry'

const Interface = createInterfaceClass('kurs-pm-admin-web-namespace')

export const IMobxStore = new Interface({
  name: 'IMobxStore',
})

// This is a named utility used to create object prototypes
export const IObjectPrototypeFactory = new Interface({
  name: 'IObjectPrototypeFactory',
})

// This is a named utility used to deserialize json objects
export const IDeserialize = new Interface({
  name: 'IDeserialize',
})
