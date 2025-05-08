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
import { Textarea } from "@/components/ui/textarea"
import type { Skill } from "@/lib/types"

interface AddSkillDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (skill: Skill) => void
}

export function AddSkillDialog({ open, onOpenChange, onAdd }: AddSkillDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) return

    const newSkill: Skill = {
      id: uuidv4(),
      name,
      description,
    }

    onAdd(newSkill)
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
          <DialogTitle>Adicionar Habilidade</DialogTitle>
          <DialogDescription>Adicione uma nova habilidade para avaliar os colaboradores</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="skill-name">Nome da Habilidade</Label>
              <Input
                id="skill-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: React, Liderança, Atendimento ao Cliente"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="skill-description">Descrição (opcional)</Label>
              <Textarea
                id="skill-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o que esta habilidade representa"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Adicionar Habilidade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
