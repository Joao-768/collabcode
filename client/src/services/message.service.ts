import { api } from './api'
import type { ChatMessage } from '@/types'

export function listMessages(projectId: string) {
    return api.get<{ messages: ChatMessage[] }>(`/projects/${projectId}/messages`)
}
