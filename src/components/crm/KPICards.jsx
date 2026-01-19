import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle, FileText, XCircle } from "lucide-react";

export default function KPICards({ leads }) {
  const stats = {
    Lead: leads.filter(l => l.status === 'Lead').length,
    Qualificado: leads.filter(l => l.status === 'Qualificado').length,
    Proposta: leads.filter(l => l.status === 'Proposta').length,
    Fechado: leads.filter(l => l.status === 'Fechado').length,
  };

  const kpis = [
    { label: "Leads", value: stats.Lead, icon: Users, color: "bg-blue-500" },
    { label: "Qualificados", value: stats.Qualificado, icon: CheckCircle, color: "bg-yellow-500" },
    { label: "Propostas", value: stats.Proposta, icon: FileText, color: "bg-purple-500" },
    { label: "Fechados", value: stats.Fechado, icon: CheckCircle, color: "bg-green-500" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.value}</p>
              </div>
              <div className={`${kpi.color} p-3 rounded-xl bg-opacity-20`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}