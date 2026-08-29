import { api } from './api'
import type { Project } from '@/types'

export function listProjects() {
    return api.get<{ projects: Project[] }>('/projects')
}

export function createProject(name: string) {
    return api.post<{ project: Project }>('/projects', { name })
}

export function getProject(id: string) {
    return api.get<{ project: Project }>(`/projects/${id}`)
}

export function joinProject(id: string) {
    return api.post<{ project: Project }>(`/projects/${id}/join`)
}

export function deleteProject(id: string) {
    return api.delete<void>(`/projects/${id}`)
}
