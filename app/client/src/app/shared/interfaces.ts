export interface User {
  email: string
  password: string
}


export interface Catalogue {
  name: string,
  version: string,
  _id?: string,
  provider: string
}

export interface Application {
  name: string,
  version: string,
  replicas: number,
  _id?: string
  date: Date,
  url: string,
  user: string,
  status: string
}