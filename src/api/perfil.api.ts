import { randomDelay } from "./client.ts"

export const updatePassword = async (
  _senhaAtual: string,
  _novaSenha: string,
): Promise<void> => {
  await randomDelay()
}
