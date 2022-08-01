export interface User {
  email: string
  password: string
}

export interface Provider {
  name: string
}

export interface AppVersion {
  name: string,
  image: string,
  provider: Provider
}


export interface Catalogue {
  name: string,
  image: string,
  version: string,
  _id?: string,
  provider: string,
  replicas: number
}

export interface Application {
  name: string,
  image: string,
  version: string,
  replicas: number,
  _id?: string
  date: Date,
  formattedDate: string,
  url: string,
  user: string,
  status: string
}