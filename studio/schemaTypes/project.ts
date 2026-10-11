import { defineArrayMember, defineField, defineType } from 'sanity';
import { portableBody } from './portableBody';

export const project = defineType({
  name: 'project',
  title: 'Projeto / Página',
  type: 'document',
  fields: [
    defineField({
      name: 'parent',
      title: 'Página pai',
      type: 'reference',
      to: [{ type: 'project' }],
      description:
        'Deixe vazio para aparecer na listagem de trabalhos. Se preenchido, esta página só entra como card dentro da página pai (hierarquia).',
      options: {
        disableNew: true,
        filter: ({ document }) => {
          const id = document._id.replace(/^drafts\./, '');
          return {
            filter: '_type == "project" && !(_id in [$id, $draft])',
            params: { id, draft: `drafts.${id}` },
          };
        },
      },
      validation: (Rule) =>
        Rule.custom((parent, ctx) => {
          const id = ctx.document?._id?.replace(/^drafts\./, '');
          if (parent && '_ref' in parent && parent._ref.replace(/^drafts\./, '') === id) {
            return 'Uma página não pode ser pai de si mesma.';
          }
          return true;
        }),
    }),
    defineField({ name: 'title', title: 'Título', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: { source: 'title', maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'client',
      title: 'Cliente',
      type: 'string',
      description: 'Obrigatório nas páginas raiz. Nas internas, herda da página pai se ficar vazio.',
    }),
    defineField({ name: 'agency', title: 'Agência', type: 'string' }),
    defineField({ name: 'year', title: 'Ano', type: 'string' }),
    defineField({
      name: 'order',
      title: 'Ordem',
      type: 'number',
      description: 'Menor número aparece primeiro (na listagem ou entre irmãos).',
    }),
    defineField({
      name: 'cover',
      title: 'Imagem de capa',
      type: 'image',
      options: { hotspot: true },
      description: 'Card na listagem/hover, compartilhamento e topo do artigo.',
    }),
    defineField({
      name: 'cardColor',
      title: 'Cor do card (ao passar o mouse)',
      type: 'string',
      description: 'Código hexadecimal, ex.: #b8ff00. Se vazio, usa verde-limão.',
      validation: (r) =>
        r.regex(/^#[0-9a-fA-F]{6}$/, { name: 'hex', invert: false }).warning('Use o formato #RRGGBB'),
    }),
    defineField({
      name: 'categories',
      title: 'Categorias',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'category' }] })],
    }),
    defineField({
      name: 'lede',
      title: 'Abertura (opcional)',
      type: 'text',
      rows: 3,
      description: 'Linha de apoio logo abaixo do título, antes do artigo.',
    }),
    portableBody,
  ],
  preview: {
    select: { title: 'title', subtitle: 'client', media: 'cover', parent: 'parent.title' },
    prepare: ({ title, subtitle, media, parent }) => ({
      title,
      subtitle: parent ? `↳ ${parent}${subtitle ? ' · ' + subtitle : ''}` : subtitle,
      media,
    }),
  },
});
