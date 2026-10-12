import { defineArrayMember, defineField } from 'sanity';

export const portableBody = defineField({
  name: 'body',
  title: 'Artigo',
  type: 'array',
  description:
    'Corpo livre: texto formatado, títulos, imagens, galerias, carrosséis, áudios, vídeos e cards para páginas mais profundas.',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        { title: 'Parágrafo', value: 'normal' },
        { title: 'Título', value: 'h2' },
        { title: 'Subtítulo', value: 'h3' },
        { title: 'Título menor', value: 'h4' },
        { title: 'Citação', value: 'blockquote' },
      ],
      lists: [
        { title: 'Lista', value: 'bullet' },
        { title: 'Numerada', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Negrito', value: 'strong' },
          { title: 'Itálico', value: 'em' },
          { title: 'Sublinhado', value: 'underline' },
        ],
        annotations: [
          {
            name: 'link',
            type: 'object',
            title: 'Link',
            fields: [
              defineField({
                name: 'href',
                title: 'URL',
                type: 'url',
                validation: (r) =>
                  r.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
              }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Imagem',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
        defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
        defineField({
          name: 'layout',
          title: 'Largura',
          type: 'string',
          initialValue: 'wide',
          options: {
            layout: 'radio',
            list: [
              { title: 'Largura do texto', value: 'content' },
              { title: 'Ampla', value: 'wide' },
              { title: 'Tela inteira', value: 'full' },
            ],
          },
        }),
      ],
      preview: {
        select: { media: 'asset', title: 'alt', caption: 'caption' },
        prepare: ({ media, title, caption }) => ({
          media,
          title: title || caption || 'Imagem',
          subtitle: 'Imagem',
        }),
      },
    }),
    defineArrayMember({
      name: 'gallery',
      title: 'Galeria',
      type: 'object',
      fields: [
        defineField({
          name: 'images',
          title: 'Imagens',
          type: 'array',
          of: [
            defineArrayMember({
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
                defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
              ],
            }),
            defineArrayMember({
              type: 'file',
              title: 'Vídeo',
              options: { accept: 'video/*' },
            }),
          ],
        }),
      ],
      preview: {
        select: { media: 'images.0' },
        prepare: ({ media }) => ({ media, title: 'Galeria' }),
      },
    }),
    defineArrayMember({
      name: 'carousel',
      title: 'Carrossel',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título (opcional)', type: 'string' }),
        defineField({ name: 'description', title: 'Descrição (opcional)', type: 'text', rows: 2 }),
        defineField({
          name: 'images',
          title: 'Slides (imagens e vídeos)',
          type: 'array',
          description: 'Adicione imagens e/ou arquivos de vídeo em qualquer ordem.',
          of: [
            defineArrayMember({
              type: 'image',
              options: { hotspot: true },
              fields: [
                defineField({ name: 'alt', title: 'Texto alternativo', type: 'string' }),
                defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
              ],
            }),
          ],
          validation: (Rule) => Rule.min(1),
        }),
      ],
      preview: {
        select: { title: 'title', media: 'images.0' },
        prepare: ({ title, media }) => ({ title: title || 'Carrossel', subtitle: 'Carrossel de imagens', media }),
      },
    }),
    defineArrayMember({
      name: 'audio',
      title: 'Áudio',
      type: 'object',
      fields: [
        defineField({ name: 'title', title: 'Título (opcional)', type: 'string' }),
        defineField({ name: 'description', title: 'Descrição (opcional)', type: 'text', rows: 2 }),
        defineField({
          name: 'file',
          title: 'Arquivo de áudio',
          type: 'file',
          options: { accept: 'audio/*' },
          validation: (Rule) => Rule.required(),
        }),
      ],
      preview: {
        select: { title: 'title', media: 'file.asset' },
        prepare: ({ title, media }) => ({ title: title || 'Faixa de áudio', subtitle: 'Áudio', media }),
      },
    }),
    defineArrayMember({
      name: 'video',
      title: 'Vídeo (Vimeo/YouTube)',
      type: 'object',
      fields: [
        defineField({ name: 'url', title: 'Link do vídeo', type: 'url', validation: (r) => r.required() }),
        defineField({ name: 'caption', title: 'Legenda', type: 'string' }),
      ],
      preview: {
        select: { title: 'url' },
        prepare: ({ title }) => ({ title: title || 'Vídeo', subtitle: 'Vídeo' }),
      },
    }),
    defineArrayMember({
      name: 'cards',
      title: 'Cards para outras páginas',
      type: 'object',
      description: 'Grade de cards que levam a páginas mais profundas (ou a qualquer outro projeto).',
      fields: [
        defineField({ name: 'heading', title: 'Título da seção (opcional)', type: 'string' }),
        defineField({
          name: 'items',
          title: 'Páginas',
          type: 'array',
          of: [defineArrayMember({ type: 'reference', to: [{ type: 'project' }] })],
          validation: (r) => r.min(1),
        }),
      ],
      preview: {
        select: { title: 'heading' },
        prepare: ({ title }) => ({ title: title || 'Cards', subtitle: 'Navegação interna' }),
      },
    }),
  ],
});
