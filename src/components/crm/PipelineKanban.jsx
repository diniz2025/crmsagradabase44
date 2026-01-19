import React from "react";
import { base44 } from "@/api/base44Client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";

const stages = ['Lead', 'Qualificado', 'Proposta', 'Fechado', 'Descartado'];
const stageColors = {
  Lead: 'bg-blue-500',
  Qualificado: 'bg-yellow-500',
  Proposta: 'bg-purple-500',
  Fechado: 'bg-green-500',
  Descartado: 'bg-gray-500'
};

export default function PipelineKanban({ leads, onRefetch, onEdit }) {
  const [draggedId, setDraggedId] = React.useState(null);

  const updateMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const lead = leads.find(l => l.id === id);
      await base44.entities.Lead.update(id, { status });
      
      // Registrar mudança de status no histórico
      await base44.entities.HistoricoStatus.create({
        lead_id: id,
        status: status,
        data_mudanca: new Date().toISOString(),
        vendedor: lead?.vendedor
      });
      
      return { id, status };
    },
    onSuccess: () => {
      onRefetch();
    },
  });

  const handleDragStart = (e, leadId) => {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedId) {
      updateMutation.mutate({ id: draggedId, status: newStatus });
      setDraggedId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {stages.map(stage => {
        const stageLeads = leads.filter(l => l.status === stage);
        return (
          <div key={stage} className="flex flex-col">
            <div className={`${stageColors[stage]} text-white px-4 py-3 rounded-t-lg font-semibold flex justify-between items-center`}>
              <span>{stage}</span>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {stageLeads.length}
              </Badge>
            </div>
            
            <div
              className="bg-gray-100 min-h-[500px] p-3 rounded-b-lg space-y-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage)}
            >
              {stageLeads.map(lead => (
                <Card
                  key={lead.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, lead.id)}
                  className="cursor-move hover:shadow-lg transition-shadow bg-white"
                  onClick={() => onEdit(lead)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
                        {lead.nome_completo}
                      </h3>
                      {lead.score !== undefined && lead.score !== null && (
                        <div className={`ml-2 px-2 py-0.5 rounded-full text-xs font-bold ${
                          lead.score >= 80 ? 'bg-green-500 text-white' :
                          lead.score >= 60 ? 'bg-yellow-500 text-white' :
                          lead.score >= 40 ? 'bg-orange-500 text-white' :
                          'bg-red-500 text-white'
                        }`}>
                          {lead.score}
                        </div>
                      )}
                    </div>
                    
                    {lead.vendedor && (
                      <p className="text-xs text-gray-500 mb-2">
                        👤 {lead.vendedor}
                      </p>
                    )}
                    
                    {lead.cidade && (
                      <p className="text-xs text-gray-500 mb-2">
                        📍 {lead.cidade}
                      </p>
                    )}
                    
                    <div className="flex gap-2 mt-3">
                      {lead.telefone && (
                        <div className="flex-1 text-center">
                          <Phone className="w-3 h-3 mx-auto text-green-600" />
                        </div>
                      )}
                      {lead.email && (
                        <div className="flex-1 text-center">
                          <Mail className="w-3 h-3 mx-auto text-blue-600" />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {stageLeads.length === 0 && (
                <div className="text-center text-gray-400 text-sm py-8">
                  Arraste leads aqui
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}