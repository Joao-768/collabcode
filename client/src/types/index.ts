export type User = {
    id: string
    email: string
    name: string
}

export type ProjectMember = {
    role: 'OWNER' | 'COLLABORATOR'
    user: User
}

export type Project = {
    id: string
    name: string
    ownerId: string
    createdAt: string
    updatedAt: string
    _count?: { files: number; members: number }
    members?: ProjectMember[]
}

export const SUPPORTED_LANGUAGES = ['javascript', 'typescript', 'json', 'html', 'css'] as const

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number]

export type ProjectFile = {
    id: string
    name: string
    language: SupportedLanguage
    createdAt: string
    updatedAt: string
}

export type FileContent = {
    id: string
    name: string
    language: SupportedLanguage
    content: string
    projectId: string
}
