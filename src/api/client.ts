export type ApiResponse<T> = {
  readonly data: T
  readonly success: boolean
  readonly message?: string
}

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const randomDelay = (): Promise<void> =>
  delay(300 + Math.random() * 700)

export const mockRequest = async <T>(data: T): Promise<ApiResponse<T>> => {
  await randomDelay()
  return { data, success: true }
}
