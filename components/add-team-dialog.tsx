"use client"

import type React from "react"

import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
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
import type { Team } from "@/lib/types"

interface AddTeamDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (team: Team) => void
}

export function AddTeamDialog({ open, onOpenChange, onAdd }: AddTeamDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) return

    const newTeam: Team = {
      id: uuidv4(),
      name,
      description,
      collaborators: [],
    }

    onAdd(newTeam)
    resetForm()
  }

  const resetForm = () => {
    setName("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Equipe</DialogTitle>
          <DialogDescription>Crie uma nova equipe para organizar seus colaboradores</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="team-name">Nome da Equipe</Label>
              <Input
                id="team-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Comercial, TI, Marketing"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="team-description">Descrição (opcional)</Label>
              <Input
                id="team-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva a função desta equipe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Adicionar Equipe</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
