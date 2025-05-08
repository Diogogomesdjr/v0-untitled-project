"use client"

import { useEffect, useState } from "react"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Collaborator, Skill } from "@/lib/types"

interface SkillRadarChartProps {
  collaborator: Collaborator
  skills: Skill[]
  allCollaborators?: Collaborator[]
  compareMode?: boolean
}

export function SkillRadarChart({
  collaborator,
  skills,
  allCollaborators = [],
  compareMode = false,
}: SkillRadarChartProps) {
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação com o SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Transformar os dados para o formato que o RadarChart espera
  const chartData = skills.map((skill) => {
    const data: Record<string, any> = {
      skill: skill.name,
    }

    // Adicionar o valor da habilidade do colaborador principal
    const rating = collaborator.skills[skill.id]
    data[collaborator.name] = rating === "N/A" ? 0 : Number(rating) || 0

    // Se estiver no modo de comparação, adicionar os valores dos outros colaboradores
    if (compareMode) {
      allCollaborators.forEach((collab) => {
        if (collab.id !== collaborator.id) {
          const collabRating = collab.skills[skill.id]
          data[collab.name] = collabRating === "N/A" ? 0 : Number(collabRating) || 0
        }
      })
    }

    return data
  })

  // Gerar cores únicas para cada colaborador
  const getCollaboratorColor = (index: number) => {
    const colors = [
      "#22c55e", // verde
      "#3b82f6", // azul
      "#f97316", // laranja
      "#ec4899", // rosa
      "#a855f7", // roxo
      "#14b8a6", // teal
    ]
    return colors[index % colors.length]
  }

  if (!mounted) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Perfil de Habilidades</CardTitle>
          <CardDescription>
            Visualização das habilidades de {collaborator.name}
            {compareMode ? " comparado com outros colaboradores" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px] w-full flex items-center justify-center">
            <p>Carregando gráfico...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Perfil de Habilidades</CardTitle>
        <CardDescription>
          Visualização das habilidades de {collaborator.name}
          {compareMode ? " comparado com outros colaboradores" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="skill" />
                <PolarRadiusAxis angle={30} domain={[0, 5]} />

                <Radar
                  name={collaborator.name}
                  dataKey={collaborator.name}
                  stroke={getCollaboratorColor(0)}
                  fill={getCollaboratorColor(0)}
                  fillOpacity={0.6}
                />

                {compareMode &&
                  allCollaborators
                    .filter((collab) => collab.id !== collaborator.id)
                    .map((collab, index) => (
                      <Radar
                        key={collab.id}
                        name={collab.name}
                        dataKey={collab.name}
                        stroke={getCollaboratorColor(index + 1)}
                        fill={getCollaboratorColor(index + 1)}
                        fillOpacity={0.6}
                      />
                    ))}

                <Tooltip />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Nenhuma habilidade avaliada ainda</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
