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
