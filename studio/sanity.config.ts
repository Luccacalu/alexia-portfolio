import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schemaTypes';

export default defineConfig({
  name: 'default',
  title: 'Portfólio',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'SEU_PROJECT_ID',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Conteúdo')
          .items([
            // Configurações do site: documento único
            S.listItem()
              .title('Configurações do site')
              .id('siteSettings')
              .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
            S.divider(),
            S.listItem()
              .title('Projetos (listagem)')
              .schemaType('project')
              .child(
                S.documentTypeList('project')
                  .title('Projetos')
                  .filter('_type == "project" && !defined(parent)')
              ),
            S.listItem()
              .title('Páginas internas')
              .schemaType('project')
              .child(
                S.documentTypeList('project')
                  .title('Páginas internas')
                  .filter('_type == "project" && defined(parent)')
              ),
            S.documentTypeListItem('project').title('Todas as páginas'),
            S.documentTypeListItem('category').title('Categorias'),
          ]),
    }),
  ],
  schema: { types: schemaTypes },
});
