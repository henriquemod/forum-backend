export namespace Hash {
  export interface Generate {
    generate: (value: string) => Promise<string>
  }

  export interface Compare {
    compare: (value: string, hash: string) => Promise<boolean>
  }
}
