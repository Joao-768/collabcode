import { api } from './api'
import type { ProjectFile, FileContent, SupportedLanguage } from '@/types'

export function listFiles(projectId: string) {
    return api.get<{ files: ProjectFile[] }>(`/projects/${projectId}/files`)
}

export function createFile(projectId: string, name: string, language: SupportedLanguage) {
    return api.post<{ file: ProjectFile }>(`/projects/${projectId}/files`, { name, language })
}

export function getFile(fileId: string) {
    return api.get<{ file: FileContent }>(`/files/${fileId}`)
}

export function renameFile(fileId: string, name: string) {
    return api.patch<{ file: ProjectFile }>(`/files/${fileId}`, { name })
}

export function deleteFile(fileId: string) {
    return api.delete<void>(`/files/${fileId}`)
}
