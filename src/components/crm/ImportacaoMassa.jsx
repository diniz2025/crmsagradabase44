import React, { useState, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Pause, Play, X, CheckCircle, AlertCircle } from "lucide-react";

export default function ImportacaoMassa({ onComplete, vendedores, corretoras, minhaCorretoraId }) {
  const [processando, setProcessando] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [progresso, setProgresso] = useState({ total: 0, importados: 0, erros: 0 });
  const [logs, setLogs] = useState([]);
  const fileInputRef = useRef(null);
  const pausarRef = useRef(false);

  const adicionarLog = (mensagem, tipo = 'info') => {
    setLogs(prev => [...prev.slice(-4), { mensagem, tipo, hora: new Date().toLocaleTimeString() }]);
  };

  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim().replace(/^"|"$/g, ''));
    return result;
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setProcessando(true);
    setPausado(false);
    pausarRef.current = false;
    setProgresso({ total: 0, importados: 0, erros: 0 });
    setLogs([]);
    
    adicionarLog(`Lendo arquivo: ${file.name}`, 'info');

    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter(line => line.trim());
      
      if (lines.length < 2) {
        adicionarLog('Arquivo CSV vazio ou inválido', 'error');
        setProcessando(false);
        return;
      }

      const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().replace(/[\s]/g, '_'));
      adicionarLog(`Headers: ${headers.join(', ')}`, 'info');
      
      const newLeads = [];
      for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        const lead = {
          nome_completo: values[headers.indexOf('nome_completo')] || values[headers.indexOf('nome')] || values[0] || '',
          cnpj: values[headers.indexOf('cnpj')] || '',
          cidade: values[headers.indexOf('cidade')] || '',
          telefone: values[headers.indexOf('telefone')] || values[headers.indexOf('fone')] || '',
          email: values[headers.indexOf('email')] || '',
          contato: values[headers.indexOf('contato')] || '',
          tipo_estabelecimento: values[headers.indexOf('tipo_estabelecimento')] || values[headers.indexOf('tipo')] || '',
          numero_funcionarios: values[headers.indexOf('numero_funcionarios')] || values[headers.indexOf('funcionarios')] || '',
          status: 'Lead',
          vendedor: vendedores[0]?.nome || '',
          corretora_id: minhaCorretoraId || corretoras[0]?.id || ''
        };
        
        if (lead.nome_completo && lead.nome_completo.trim()) {
          newLeads.push(lead);
        }
      }
      
      setProgresso(prev => ({ ...prev, total: newLeads.length }));
      adicionarLog(`${newLeads.length} leads prontos para importação`, 'success');

      // Importação em lotes pequenos com delay
      const BATCH_SIZE = 10;
      const DELAY_MS = 600;
      let importados = 0;
      let erros = 0;

      for (let i = 0; i < newLeads.length; i += BATCH_SIZE) {
        // Verifica se foi pausado
        while (pausarRef.current) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const batch = newLeads.slice(i, i + BATCH_SIZE);
        
        try {
          await base44.entities.Lead.bulkCreate(batch);
          importados += batch.length;
          setProgresso(prev => ({ ...prev, importados }));
          
          if (i % 50 === 0) {
            adicionarLog(`Progresso: ${importados}/${newLeads.length}`, 'info');
          }
          
          // Delay entre lotes
          if (i + BATCH_SIZE < newLeads.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
          }
        } catch (error) {
          erros += batch.length;
          setProgresso(prev => ({ ...prev, erros }));
          adicionarLog(`Erro no lote ${Math.floor(i/BATCH_SIZE) + 1}: ${error.message}`, 'error');
          
          // Aumenta o delay em caso de erro
          await new Promise(resolve => setTimeout(resolve, DELAY_MS * 2));
        }
      }
      
      adicionarLog(`✅ Concluído! ${importados} importados, ${erros} erros`, 'success');
      setProcessando(false);
      
      if (onComplete) {
        setTimeout(() => onComplete(), 1000);
      }
      
    } catch (error) {
      adicionarLog(`❌ Erro: ${error.message}`, 'error');
      setProcessando(false);
    }
    
    e.target.value = '';
  };

  const togglePausar = () => {
    pausarRef.current = !pausarRef.current;
    setPausado(!pausado);
    adicionarLog(pausarRef.current ? 'Importação pausada' : 'Importação retomada', 'info');
  };

  const cancelar = () => {
    setProcessando(false);
    setPausado(false);
    pausarRef.current = false;
    adicionarLog('Importação cancelada', 'error');
  };

  const porcentagem = progresso.total > 0 
    ? Math.round((progresso.importados / progresso.total) * 100) 
    : 0;

  return (
    <Card className="border-2 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Importação em Massa (até 50.000 empresas)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg text-sm space-y-2">
          <p className="font-medium">📋 Formato do CSV:</p>
          <p className="text-gray-700">
            Colunas: <code>nome_completo, cnpj, cidade, telefone, email, contato, tipo_estabelecimento, numero_funcionarios</code>
          </p>
          <p className="text-gray-600 text-xs">
            ⚡ Sistema otimizado: processa 10 leads por vez com delay de 600ms entre lotes
          </p>
        </div>

        {!processando ? (
          <Button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Arquivo CSV
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progresso: {progresso.importados}/{progresso.total}</span>
                <span className="font-bold">{porcentagem}%</span>
              </div>
              <Progress value={porcentagem} className="h-3" />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={togglePausar}
                variant="outline"
                className="flex-1"
              >
                {pausado ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                {pausado ? 'Retomar' : 'Pausar'}
              </Button>
              <Button 
                onClick={cancelar}
                variant="destructive"
                className="flex-1"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>

            {progresso.erros > 0 && (
              <div className="bg-red-50 p-3 rounded flex items-center gap-2 text-sm text-red-800">
                <AlertCircle className="w-4 h-4" />
                {progresso.erros} erros detectados
              </div>
            )}
          </div>
        )}

        {logs.length > 0 && (
          <div className="bg-gray-50 p-3 rounded space-y-1 text-xs font-mono max-h-32 overflow-y-auto">
            {logs.map((log, idx) => (
              <div 
                key={idx} 
                className={`flex items-start gap-2 ${
                  log.tipo === 'error' ? 'text-red-600' : 
                  log.tipo === 'success' ? 'text-green-600' : 
                  'text-gray-600'
                }`}
              >
                <span className="text-gray-400">{log.hora}</span>
                <span>{log.mensagem}</span>
              </div>
            ))}
          </div>
        )}

        <input 
          ref={fileInputRef}
          type="file" 
          accept=".csv" 
          onChange={handleImport} 
          className="hidden" 
        />
      </CardContent>
    </Card>
  );
}