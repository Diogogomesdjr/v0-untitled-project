export interface Collaborator {
  id: string
  name: string
  photoUrl?: string
  isFocal: boolean
  skills: Record<string, string | number>
  aptitude?: Record<string, boolean>
}

export interface Team {
  id: string
  name: string
  description?: string
  collaborators: Collaborator[]
}

export interface Skill {
  id: string
  name: string
  description?: string
}
