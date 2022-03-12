export interface BlocksData {
  index: number,
  data: string,
}

export interface Blocks {
  list: Array<object>,
  loading: boolean,
  error: boolean,
}
