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

const EXTENSIONS: Record<string, SupportedLanguage> = {
    js: 'javascript',
    mjs: 'javascript',
    cjs: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    json: 'json',
    html: 'html',
    htm: 'html',
    css: 'css',
}

/** The language a file name implies. Naming a file index.js already says what
 *  it is, so asking again in a dropdown is a question with one right answer. */
export function languageFromName(name: string): SupportedLanguage {
    const extension = name.split('.').pop()?.toLowerCase() ?? ''
    return EXTENSIONS[extension] ?? 'javascript'
}

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

export type PresenceUser = {
    userId: string
    name: string
    color: string
}

export type ChatMessage = {
    id: string
    content: string
    createdAt: string
    user: {
        id: string
        name: string
    }
}
