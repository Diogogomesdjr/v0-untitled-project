import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SkillLegend() {
  const legendItems = [
    {
      value: "N/A",
      label: "Não Aplicável",
      description: "Esta habilidade não se aplica ao colaborador",
      color: "bg-gray-200 text-gray-700",
    },
    {
      value: "1",
      label: "Iniciante",
      description: "Conhecimento básico, precisa de supervisão constante",
      color: "bg-red-600 text-white",
    },
    {
      value: "2",
      label: "Básico",
      description: "Conhecimento limitado, precisa de supervisão frequente",
      color: "bg-red-400 text-white",
    },
    {
      value: "3",
      label: "Intermediário",
      description: "Conhecimento adequado, precisa de supervisão ocasional",
      color: "bg-yellow-400 text-gray-800",
    },
    {
      value: "4",
      label: "Avançado",
      description: "Bom conhecimento, raramente precisa de supervisão",
      color: "bg-green-400 text-gray-800",
    },
    {
      value: "5",
      label: "Especialista",
      description: "Excelente conhecimento, pode ensinar outros",
      color: "bg-green-600 text-white",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Legenda de Habilidades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {legendItems.map((item) => (
            <div key={item.value} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${item.color}`}>
                {item.value}
              </div>
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-sm text-gray-500">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
