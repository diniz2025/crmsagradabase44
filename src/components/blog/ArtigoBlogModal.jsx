import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { X, Upload } from "lucide-react";

const categoriaLabels = {
  plano_saude: "Plano de Saúde",
  seguro_incendio: "Seguro de Incêndio",
  dicas_seguranca: "Dicas de Segurança",
  noticias: "Notícias",
  rh_trabalhista: "RH & Trabalhista",
  gestao: "Gestão"
};

export default function ArtigoBlogModal({ artigo, onClose, onSave }) {
  const [formData, setFormData] = useState(artigo || {
    titulo: "",
    slug: "",
    categoria: "noticias",
    resumo: "",
    conteudo: "",
    imagem_destaque: "",
    autor: "Nadjair Diniz Barbosa",
    publicado: true,
    destaque: false,
    tags: ""
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  const queryClient = useQueryClient();

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (artigo) {
        return base44.entities.ArtigoBlog.update(artigo.id, data);
      } else {
        return base44.entities.ArtigoBlog.create(data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artigos'] });
      onSave();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.ArtigoBlog.delete(artigo.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['artigos'] });
      onSave();
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setFormData({ ...formData, imagem_destaque: file_url });
    } catch (error) {
      alert('Erro ao fazer upload da imagem');
    } finally {
      setUploadingImage(false);
    }
  };

  const gerarSlug = (titulo) => {
    return titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full my-8 relative">
        <div className="sticky top-0 bg-gradient-to-r from-[#4DBABC] to-[#45B1B3] text-white px-6 py-4 rounded-t-2xl flex justify-between items-center z-10">
          <h2 className="text-2xl font-bold">
            {artigo ? 'Editar Artigo' : 'Novo Artigo'}
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Título *</Label>
              <Input
                value={formData.titulo}
                onChange={(e) => {
                  const titulo = e.target.value;
                  setFormData({
                    ...formData,
                    titulo,
                    slug: formData.slug || gerarSlug(titulo)
                  });
                }}
                required
                placeholder="Digite o título do artigo"
              />
            </div>

            <div>
              <Label>Slug (URL) *</Label>
              <Input
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                placeholder="url-amigavel-do-artigo"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Categoria *</Label>
              <select
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4DBABC] focus:border-transparent"
                required
              >
                {Object.entries(categoriaLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Autor</Label>
              <Input
                value={formData.autor}
                onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                placeholder="Nome do autor"
              />
            </div>
          </div>

          <div>
            <Label>Resumo</Label>
            <Textarea
              value={formData.resumo}
              onChange={(e) => setFormData({ ...formData, resumo: e.target.value })}
              rows={3}
              placeholder="Breve resumo do artigo (aparece na listagem)"
            />
          </div>

          <div>
            <Label>Conteúdo (Markdown) *</Label>
            <Textarea
              value={formData.conteudo}
              onChange={(e) => setFormData({ ...formData, conteudo: e.target.value })}
              rows={12}
              required
              placeholder="Digite o conteúdo do artigo em Markdown..."
              className="font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use Markdown: **negrito**, *itálico*, # Título, ## Subtítulo, [link](url), ![imagem](url)
            </p>
          </div>

          <div>
            <Label>Imagem de Destaque</Label>
            <div className="flex gap-2">
              <Input
                value={formData.imagem_destaque}
                onChange={(e) => setFormData({ ...formData, imagem_destaque: e.target.value })}
                placeholder="URL da imagem"
              />
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Button type="button" variant="outline" disabled={uploadingImage}>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadingImage ? 'Enviando...' : 'Upload'}
                </Button>
              </label>
            </div>
            {formData.imagem_destaque && (
              <img src={formData.imagem_destaque} alt="Preview" className="mt-2 h-32 object-cover rounded-lg" />
            )}
          </div>

          <div>
            <Label>Tags (separadas por vírgula)</Label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="segurança, dicas, saúde"
            />
          </div>

          <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Switch
                checked={formData.publicado}
                onCheckedChange={(checked) => setFormData({ ...formData, publicado: checked })}
              />
              <Label className="cursor-pointer">Publicado</Label>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                checked={formData.destaque}
                onCheckedChange={(checked) => setFormData({ ...formData, destaque: checked })}
              />
              <Label className="cursor-pointer">Artigo em Destaque</Label>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="submit" className="flex-1 bg-[#4DBABC] hover:bg-[#45B1B3]" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? 'Salvando...' : 'Salvar Artigo'}
            </Button>
            {artigo && (
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este artigo?')) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}