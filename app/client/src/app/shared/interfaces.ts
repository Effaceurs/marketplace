export interface User {
  email: string
  password: string
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