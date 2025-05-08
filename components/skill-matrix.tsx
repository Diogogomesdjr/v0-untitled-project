"use client"

import { useState } from "react"
import { Plus, UserPlus, Users, Trash2, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddCollaboratorDialog } from "@/components/add-collaborator-dialog"
import { AddSkillDialog } from "@/components/add-skill-dialog"
import { AddTeamDialog } from "@/components/add-team-dialog"
import { SkillLegend } from "@/components/skill-legend"
import type { Collaborator, Skill, Team } from "@/lib/types"

export default function SkillMatrix() {
  const [teams, setTeams] = useState<Team[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [selectedTeam, setSelectedTeam] = useState<string>("all")
  const [selectedCollaborator, setSelectedCollaborator] = useState<string | null>(null)
  const [isAddCollaboratorOpen, setIsAddCollaboratorOpen] = useState(false)
  const [isAddSkillOpen, setIsAddSkillOpen] = useState(false)
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false)

  const allCollaborators = teams.flatMap((team) => team.collaborators)

  const filteredCollaborators =
    selectedTeam === "all" ? allCollaborators : teams.find((team) => team.id === selectedTeam)?.collaborators || []

  const displayedCollaborators =
    selectedCollaborator && selectedCollaborator !== "all"
      ? allCollaborators.filter((collab) => collab.id === selectedCollaborator)
      : filteredCollaborators

  const handleAddCollaborator = (newCollaborator: Collaborator, teamId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId ? { ...team, collaborators: [...team.collaborators, newCollaborator] } : team,
      ),
    )
    setIsAddCollaboratorOpen(false)
  }

  const handleAddSkill = (newSkill: Skill) => {
    setSkills([...skills, newSkill])
    setIsAddSkillOpen(false)
  }

  const handleAddTeam = (newTeam: Team) => {
    setTeams([...teams, newTeam])
    setIsAddTeamOpen(false)
  }

  const handleDeleteCollaborator = (collaboratorId: string) => {
    if (confirm("Tem certeza que deseja excluir este colaborador?")) {
      setTeams(
        teams.map((team) => ({
          ...team,
          collaborators: team.collaborators.filter((c) => c.id !== collaboratorId),
        })),
      )

      if (selectedCollaborator === collaboratorId) {
        setSelectedCollaborator(null)
      }
    }
  }

  const handleDeleteTeam = (teamId: string) => {
    // Check if team has collaborators
    const team = teams.find((t) => t.id === teamId)
    if (team && team.collaborators.length > 0) {
      if (!confirm(`Esta equipe possui ${team.collaborators.length} colaborador(es). Deseja realmente excluir?`)) {
        return
      }
    }

    setTeams(teams.filter((team) => team.id !== teamId))

    if (selectedTeam === teamId) {
      setSelectedTeam("all")
    }
  }

  const handleToggleFocal = (collaboratorId: string) => {
    setTeams(
      teams.map((team) => ({
        ...team,
        collaborators: team.collaborators.map((c) => (c.id === collaboratorId ? { ...c, isFocal: !c.isFocal } : c)),
      })),
    )
  }

  const handleSkillRating = (collaboratorId: string, skillId: string) => {
    setTeams(
      teams.map((team) => ({
        ...team,
        collaborators: team.collaborators.map((c) => {
          if (c.id === collaboratorId) {
            const currentRating = c.skills[skillId] || "N/A"
            let newRating: string | number = "N/A"

            if (currentRating === "N/A") newRating = 1
            else if (currentRating === 5) newRating = "N/A"
            else newRating = (currentRating as number) + 1

            return {
              ...c,
              skills: {
                ...c.skills,
                [skillId]: newRating,
              },
            }
          }
          return c
        }),
      })),
    )
  }

  const handleToggleAptitude = (collaboratorId: string, skillId: string) => {
    setTeams(
      teams.map((team) => ({
        ...team,
        collaborators: team.collaborators.map((c) => {
          if (c.id === collaboratorId) {
            const currentAptitude = c.aptitude?.[skillId] || false

            return {
              ...c,
              aptitude: {
                ...(c.aptitude || {}),
                [skillId]: !currentAptitude,
              },
            }
          }
          return c
        }),
      })),
    )
  }

  const getRatingColorClass = (rating: string | number) => {
    if (rating === "N/A") return "bg-gray-200 text-gray-700"
    if (rating === 1) return "bg-red-600 text-white"
    if (rating === 2) return "bg-red-400 text-white"
    if (rating === 3) return "bg-yellow-400 text-gray-800"
    if (rating === 4) return "bg-green-400 text-gray-800"
    if (rating === 5) return "bg-green-600 text-white"
    return "bg-gray-200"
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Matriz de Habilidades</CardTitle>
          <CardDescription>Gerencie as habilidades dos colaboradores da sua empresa</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma equipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as equipes</SelectItem>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedCollaborator || "all"} onValueChange={setSelectedCollaborator}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um colaborador" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os colaboradores</SelectItem>
              {allCollaborators.map((collab) => (
                <SelectItem key={collab.id} value={collab.id}>
                  {collab.name} {collab.isFocal && "👑"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button onClick={() => setIsAddTeamOpen(true)} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Equipe
          </Button>

          <Button onClick={() => setIsAddCollaboratorOpen(true)} disabled={teams.length === 0}>
            <UserPlus className="mr-2 h-4 w-4" />
            Colaborador
          </Button>
        </div>

        <div>
          <Button onClick={() => setIsAddSkillOpen(true)} variant="outline" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Habilidade
          </Button>
        </div>
      </div>

      {teams.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium mb-2">Nenhuma equipe cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Comece adicionando uma equipe para organizar seus colaboradores
              </p>
              <Button onClick={() => setIsAddTeamOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Equipe
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {skills.length === 0 ? (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="text-center p-6">
              <h3 className="text-lg font-medium mb-2">Nenhuma habilidade cadastrada</h3>
              <p className="text-muted-foreground mb-4">
                Adicione habilidades para começar a avaliar seus colaboradores
              </p>
              <Button onClick={() => setIsAddSkillOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Habilidade
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="lg:col-span-3">
            <SkillLegend />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Equipes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {teams.map((team) => (
                    <div key={team.id} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{team.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({team.collaborators.length} colaboradores)
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTeam(team.id)}>
                        <span className="sr-only">Excluir equipe</span>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {skills.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-6">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-800">
                <th className="p-3 text-left border">Colaborador</th>
                {skills.map((skill) => (
                  <th key={skill.id} className="p-3 text-center border min-w-[120px]">
                    {skill.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayedCollaborators.length > 0 ? (
                displayedCollaborators.map((collaborator) => (
                  <tr key={collaborator.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="p-3 border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {collaborator.photoUrl ? (
                            <img
                              src={collaborator.photoUrl || "/placeholder.svg"}
                              alt={collaborator.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{collaborator.name}</span>
                              {collaborator.isFocal && (
                                <Shield className="h-5 w-5 text-blue-500" title="Colaborador Responsável" />
                              )}
                            </div>
                            <span className="text-sm text-gray-500">
                              {teams.find((t) => t.collaborators.some((c) => c.id === collaborator.id))?.name}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleFocal(collaborator.id)}
                            className="opacity-30 hover:opacity-100 transition-opacity"
                            title={collaborator.isFocal ? "Remover como responsável" : "Marcar como responsável"}
                          >
                            <Shield className={`h-4 w-4 ${collaborator.isFocal ? "text-blue-500" : "text-gray-400"}`} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCollaborator(collaborator.id)}
                            className="opacity-30 hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </td>

                    {skills.map((skill) => {
                      const rating = collaborator.skills[skill.id] || "N/A"
                      const isApt = collaborator.aptitude?.[skill.id] || false

                      return (
                        <td key={`${collaborator.id}-${skill.id}`} className="p-3 border text-center">
                          <div className="flex flex-col items-center gap-2">
                            <button
                              onClick={() => handleSkillRating(collaborator.id, skill.id)}
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${getRatingColorClass(rating)}`}
                            >
                              {rating}
                            </button>
                            <button
                              onClick={() => handleToggleAptitude(collaborator.id, skill.id)}
                              className={`text-xs px-2 py-1 rounded ${isApt ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}`}
                            >
                              {isApt ? "Apto" : "Não apto"}
                            </button>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={skills.length + 1} className="p-6 text-center border">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="h-8 w-8 text-gray-400" />
                      <p className="text-muted-foreground">Nenhum colaborador encontrado</p>
                      {teams.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsAddCollaboratorOpen(true)}
                          className="mt-2"
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Adicionar Colaborador
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddCollaboratorDialog
        open={isAddCollaboratorOpen}
        onOpenChange={setIsAddCollaboratorOpen}
        onAdd={handleAddCollaborator}
        teams={teams}
      />

      <AddSkillDialog open={isAddSkillOpen} onOpenChange={setIsAddSkillOpen} onAdd={handleAddSkill} />

      <AddTeamDialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen} onAdd={handleAddTeam} />
    </div>
  )
}
