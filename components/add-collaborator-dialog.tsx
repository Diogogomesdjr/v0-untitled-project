"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { Shield, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import type { Collaborator, Team } from "@/lib/types"

interface AddCollaboratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (collaborator: Collaborator, teamId: string) => void
  teams: Team[]
}

export function AddCollaboratorDialog({ open, onOpenChange, onAdd, teams }: AddCollaboratorDialogProps) {
  const [name, setName] = useState("")
  const [teamId, setTeamId] = useState("")
  const [photoUrl, setPhotoUrl] = useState("")
  const [isFocal, setIsFocal] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name || !teamId) return

    const newCollaborator: Collaborator = {
      id: uuidv4(),
      name,
      photoUrl: photoPreview || photoUrl,
      isFocal,
      skills: {},
      aptitude: {},
    }

    onAdd(newCollaborator, teamId)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setTeamId("")
    setPhotoUrl("")
    setIsFocal(false)
    setPhotoPreview(null)
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Colaborador</DialogTitle>
          <DialogDescription>Preencha os dados do novo colaborador</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do colaborador"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="team">Equipe</Label>
              <Select value={teamId} onValueChange={setTeamId} required>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Selecione uma equipe" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo">Foto</Label>
              <div className="flex items-center gap-4">
                {photoPreview ? (
                  <img
                    src={photoPreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <Upload className="h-6 w-6 text-gray-500" />
                  </div>
                )}
                <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="flex-1" />
              </div>
              <p className="text-sm text-gray-500">Ou insira uma URL:</p>
              <Input
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://exemplo.com/foto.jpg"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch id="focal" checked={isFocal} onCheckedChange={setIsFocal} />
              <Label htmlFor="focal" className="flex items-center gap-2">
                Colaborador Responsável <Shield className="h-4 w-4 text-blue-500" />
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Adicionar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
