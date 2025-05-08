"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Collaborator, Skill } from "@/lib/types"

interface SkillBarChartProps {
  collaborator: Collaborator
  skills: Skill[]
  allCollaborators?: Collaborator[]
  compareMode?: boolean
}

export function SkillBarChart({
  collaborator,
  skills,
  allCollaborators = [],
  compareMode = false,
}: SkillBarChartProps) {
  const [mounted, setMounted] = useState(false)

  // Evita problemas de hidratação com o SSR
  useEffect(() => {
    setMounted(true)
  }, [])

  // Transformar os dados para o formato que o BarChart espera
  const chartData = skills.map((skill) => {
    const data: Record<string, any> = {
      name: skill.name,
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
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 60,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
                <YAxis domain={[0, 5]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey={collaborator.name}
                  fill={getCollaboratorColor(0)}
                  name={collaborator.name}
                  isAnimationActive={false}
                />
                {compareMode &&
                  allCollaborators
                    .filter((collab) => collab.id !== collaborator.id)
                    .map((collab, index) => (
                      <Bar
                        key={collab.id}
                        dataKey={collab.name}
                        fill={getCollaboratorColor(index + 1)}
                        name={collab.name}
                        isAnimationActive={false}
                      />
                    ))}
              </BarChart>
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
