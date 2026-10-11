import { defineArrayMember, defineField, defineType } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Projeto',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'client', title: 'Cliente', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'agency', title: 'Agência', type: 'string' }),
    defineField({ name: 'year', title: 'Ano', type: 'string' }),
    defineField({
      name: 'order',
      title: 'Ordem na listagem',
      type: 'number',
      description: 'Menor número aparece primeiro.',
    }),
    defineField({
      name: 'cover',
      title: 'Imagem de capa',
      type: 'image',
      options: { hotspot: true },
      description: 'Aparece ao passar o mouse na listagem e no compartilhamento.',
    }),
    defineField({
      name: 'cardColor',
      title: 'Cor do card (ao passar o mouse)',
      type: 'string',
      description: 'Código hexadecimal, ex.: #b8ff00. Se vazio, usa verde-limão.',
      validation: (r) => r.regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex', invert: false }).warning('Use o formato #RRGGBB'),
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
    }),
    defineField({
      name: 'blocks',
      title: 'Conteúdo do projeto',
      type: 'array',
      description: 'Monte a página na ordem: textos, imagens e vídeos.',
      of: [
        defineArrayMember({
          name: 'textBlock',
          title: 'Texto',
          type: 'object',
          fields: [defineField({ name: 'text', title: 'Texto', type: 'text', rows: 5 })],
          preview: { select: { title: 'text' }, prepare: ({ title }) => ({ title: title || 'Texto', subtitle: 'Texto' }) },
        }),
        defineArrayMember({
          name: 'imageBlock',
          title: 'Imagem',
          type: 'object',
          fields: [
            defineField({ name: 'image', title: 'Imagem', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
            defineField({ name: 'fullWidth', title: 'Largura total', type: 'boolean', initialValue: true }),
          ],
          preview: { select: { media: 'image', title: 'alt' }, prepare: ({ media, title }) => ({ media, title: title || 'Imagem', subtitle: 'Imagem' }) },
        }),
        defineArrayMember({
          name: 'videoBlock',
          title: 'Vídeo (Vimeo/YouTube)',
          type: 'object',
          fields: [
            defineField({ name: 'url', title: 'Link do vídeo', type: 'url' }),
            defineField({
              name: 'background',
              title: 'Rodar como fundo (sem controles, mudo, em loop)',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: { select: { title: 'url' }, prepare: ({ title }) => ({ title: title || 'Vídeo', subtitle: 'Vídeo' }) },
        }),
      ],
    }),
    defineField({
      name: 'stats',
      title: 'Resultados (números)',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Valor', type: 'string' }),
            defineField({ name: 'label', title: 'Rótulo', type: 'string' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        }),
      ],
    }),
    defineField({ name: 'closing', title: 'Frase final', type: 'string' }),
    defineField({
      name: 'crew',
      title: 'Ficha técnica',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'role', title: 'Função', type: 'string' }),
            defineField({ name: 'names', title: 'Nomes', type: 'array', of: [{ type: 'string' }] }),
          ],
          preview: { select: { title: 'role' } },
        }),
      ],
    }),
  ],
  preview: { select: { title: 'title', subtitle: 'client', media: 'cover' } },
});
