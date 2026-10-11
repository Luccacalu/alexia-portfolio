import { defineField, defineType } from 'sanity';

export const category = defineType({
  name: 'category',
  title: 'Categoria',
  type: 'document',
  fields: [defineField({ name: 'title', title: 'Nome', type: 'string', validation: (r) => r.required() })],
});
