import { defineArrayMember, defineField, defineType } from 'sanity';

const labelDetail = defineArrayMember({
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Título', type: 'string' }),
    defineField({ name: 'detail', title: 'Detalhe (ano, período...)', type: 'text', rows: 2 }),
  ],
  preview: { select: { title: 'label', subtitle: 'detail' } },
});

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configurações do site',
  type: 'document',
  groups: [
    { name: 'geral', title: 'Geral', default: true },
    { name: 'sobre', title: 'Sobre' },
    { name: 'clientes', title: 'Clientes' },
    { name: 'premios', title: 'Prêmios' },
    { name: 'contato', title: 'Contato' },
  ],
  fields: [
    defineField({ name: 'siteTitle', title: 'Título do site', type: 'string', group: 'geral' }),
    defineField({ name: 'description', title: 'Descrição (SEO)', type: 'text', rows: 2, group: 'geral' }),
    defineField({ name: 'firstName', title: 'Nome', type: 'string', group: 'geral' }),
    defineField({ name: 'lastName', title: 'Sobrenome', type: 'string', group: 'geral' }),
    defineField({ name: 'role', title: 'Cargo', type: 'string', group: 'geral' }),
    defineField({ name: 'heroIntro', title: 'Texto de abertura da home', type: 'text', rows: 3, group: 'geral' }),

    defineField({ name: 'aboutIntro', title: 'Texto de apresentação', type: 'text', rows: 8, group: 'sobre' }),
    defineField({ name: 'portrait', title: 'Foto', type: 'image', options: { hotspot: true }, group: 'sobre' }),
    defineField({
      name: 'sections',
      title: 'Seções de currículo',
      description: 'Ex.: Experiência, Júri, Formação, Idiomas, Mentoria...',
      type: 'array',
      group: 'sobre',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Título da seção', type: 'string' }),
            defineField({ name: 'items', title: 'Itens', type: 'array', of: [labelDetail] }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),

    defineField({
      name: 'clientGroups',
      title: 'Clientes por segmento',
      type: 'array',
      group: 'clientes',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'category', title: 'Segmento', type: 'string' }),
            defineField({
              name: 'logos',
              title: 'Logos (PNG/SVG)',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  fields: [defineField({ name: 'alt', title: 'Nome da marca', type: 'string' })],
                }),
              ],
            }),
          ],
          preview: { select: { title: 'category' } },
        }),
      ],
    }),

    defineField({
      name: 'awardGroups',
      title: 'Prêmios',
      type: 'array',
      group: 'premios',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'title', title: 'Grupo (ex.: Profissionais)', type: 'string' }),
            defineField({
              name: 'awards',
              title: 'Prêmios',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'object',
                  fields: [
                    defineField({ name: 'name', title: 'Festival/Prêmio', type: 'string' }),
                    defineField({ name: 'result', title: 'Resultado (uma linha por item)', type: 'text', rows: 3 }),
                  ],
                  preview: { select: { title: 'name', subtitle: 'result' } },
                }),
              ],
            }),
          ],
          preview: { select: { title: 'title' } },
        }),
      ],
    }),

    defineField({ name: 'email', title: 'E-mail', type: 'string', group: 'contato' }),
    defineField({
      name: 'socials',
      title: 'Redes sociais',
      type: 'array',
      group: 'contato',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Nome', type: 'string' }),
            defineField({ name: 'url', title: 'Link', type: 'url' }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
  ],
  preview: { prepare: () => ({ title: 'Configurações do site' }) },
});
