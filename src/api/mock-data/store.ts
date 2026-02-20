import { initialContratos } from "./contratos.ts"
import { initialEmpresas } from "./empresas.ts"
import { initialFiscalizacoes } from "./fiscalizacoes.ts"
import { initialFuncionarios } from "./funcionarios.ts"
import { initialNotifications } from "./notifications.ts"
import { initialUsuarios } from "./usuarios.ts"
import type { Contrato } from "@/types/contrato.ts"
import type { Empresa } from "@/types/empresa.ts"
import type { Fiscalizacao } from "@/types/fiscalizacao.ts"
import type { Funcionario } from "@/types/funcionario.ts"
import type { AppNotification } from "@/types/notification.ts"
import type { Usuario } from "@/types/usuario.ts"

// This file is excluded from functional ESLint rules
// because it simulates a mutable database

let empresas: readonly Empresa[] = [...initialEmpresas]
let contratos: readonly Contrato[] = [...initialContratos]
let fiscalizacoes: readonly Fiscalizacao[] = [...initialFiscalizacoes]
let funcionarios: readonly Funcionario[] = [...initialFuncionarios]
let usuarios: readonly Usuario[] = [...initialUsuarios]
let notifications: readonly AppNotification[] = [...initialNotifications]

export const getEmpresas = (): readonly Empresa[] => empresas
export const setEmpresas = (next: readonly Empresa[]): void => {
  empresas = next
}

export const getContratos = (): readonly Contrato[] => contratos
export const setContratos = (next: readonly Contrato[]): void => {
  contratos = next
}

export const getFiscalizacoes = (): readonly Fiscalizacao[] => fiscalizacoes
export const setFiscalizacoes = (next: readonly Fiscalizacao[]): void => {
  fiscalizacoes = next
}

export const getFuncionarios = (): readonly Funcionario[] => funcionarios
export const setFuncionarios = (next: readonly Funcionario[]): void => {
  funcionarios = next
}

export const getUsuarios = (): readonly Usuario[] => usuarios
export const setUsuarios = (next: readonly Usuario[]): void => {
  usuarios = next
}

export const getNotifications = (): readonly AppNotification[] => notifications
export const setNotifications = (next: readonly AppNotification[]): void => {
  notifications = next
}
