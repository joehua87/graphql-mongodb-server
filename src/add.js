// @flow

export function add(a: number, b: number): number {
  return a + b
}

export function addAsync(a: number, b: number): Promise<number> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(a + b)
    }, 200)
  })
}
