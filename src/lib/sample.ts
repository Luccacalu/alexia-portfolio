import type { Project, Settings } from './types';

// Dados de exemplo (genéricos). Usados quando o Sanity ainda não está configurado.
export const sampleSettings: Settings = {
  siteTitle: 'NOME SOBRENOME',
  description: 'Portfólio de copywriting de Nome Sobrenome.',
  firstName: 'NOME',
  lastName: 'SOBRENOME',
  role: 'Copywriter',
  heroIntro:
    'Sou redator publicitário.\nPalavras certas, no lugar certo.\nE com um pouco de ousadia.',
  aboutIntro:
    'Sou redator(a) com mais de 10 anos de experiência criando ideias e textos para marcas de todos os tamanhos.\n\nAntes de falar de experiências, clientes e prêmios, deixe-me contar como eu trabalho: ouvindo muito, escrevendo bastante e cortando ainda mais.\n\nGosto de textos curtos, claros e que fazem alguém sorrir ou pensar duas vezes.',
  sections: [
    {
      title: 'Experiência',
      items: [
        { label: 'Agência Exemplo A', detail: '2023 - atual' },
        { label: 'Agência Exemplo B', detail: '2020 - 2023' },
        { label: 'Agência Exemplo C', detail: '2017 - 2020' },
      ],
    },
    {
      title: 'Júri',
      items: [
        { label: 'Festival Exemplo', detail: '2024' },
        { label: 'Prêmio Exemplo', detail: '2022 e 2023' },
      ],
    },
    {
      title: 'Formação',
      items: [
        { label: 'Curso de Redação Publicitária', detail: 'Escola Exemplo' },
        { label: 'Graduação em Comunicação', detail: 'Universidade Exemplo' },
      ],
    },
    {
      title: 'Idiomas',
      items: [
        { label: 'Português', detail: 'Nativo' },
        { label: 'Inglês', detail: 'Fluente' },
      ],
    },
  ],
  clientGroups: [
    { category: 'Alimentos', logos: [{ url: '', name: 'Marca A' }, { url: '', name: 'Marca B' }] },
    { category: 'Bebidas', logos: [{ url: '', name: 'Marca C' }, { url: '', name: 'Marca D' }] },
    { category: 'Tecnologia', logos: [{ url: '', name: 'Marca E' }] },
  ],
  awardGroups: [
    {
      title: 'Profissionais',
      awards: [
        { name: 'Festival Exemplo', result: '1x Prata\n2x Shortlist' },
        { name: 'Prêmio Exemplo', result: '1x Bronze' },
      ],
    },
    {
      title: 'Estudante',
      awards: [{ name: 'Prêmio Exemplo Jovem', result: '1x Ouro' }],
    },
  ],
  email: 'ola@seudominio.com',
  socials: [
    { label: 'LinkedIn', url: 'https://linkedin.com' },
    { label: 'Instagram', url: 'https://instagram.com' },
  ],
};

const lorem =
  'Este é um texto de exemplo para descrever o desafio do projeto. Troque pelo seu briefing, a ideia criada e como ela funcionou na prática.';

const colors = ['#b8ff00', '#ffd84d', '#ff7a59', '#8ec5ff', '#f2efe9'];

const mk = (n: number, title: string, client: string, agency: string, cats: string[]): Project => ({
  slug: `projeto-exemplo-${n}`,
  title,
  client,
  agency,
  year: '2025',
  coverUrl: '',
  cardColor: colors[(n - 1) % colors.length],
  categories: cats,
  blocks: [
    { _key: 'a', _type: 'textBlock', text: lorem },
    { _key: 'b', _type: 'imageBlock', url: '', alt: 'Imagem de exemplo', fullWidth: true },
    { _key: 'c', _type: 'textBlock', text: 'Aqui você explica a solução criativa e os desdobramentos da campanha.' },
    { _key: 'd', _type: 'imageBlock', url: '', alt: 'Imagem de exemplo' },
    { _key: 'e', _type: 'imageBlock', url: '', alt: 'Imagem de exemplo' },
  ],
  stats: [
    { value: '1,2M', label: 'Alcance' },
    { value: '3MM', label: 'Interações' },
    { value: '85%', label: 'Visualização' },
  ],
  closing: 'Uma frase final que resume a ideia.',
  crew: [
    { role: 'Agência', names: [agency] },
    { role: 'Direção de Criação', names: ['Nome Exemplo'] },
    { role: 'Redação', names: ['Nome Sobrenome'] },
  ],
});

export const sampleProjects: Project[] = [
  mk(1, 'Primeira Campanha', 'Cliente Alfa', 'Agência Um', ['digital', 'integrada']),
  mk(2, 'Segunda Ideia', 'Cliente Beta', 'Agência Dois', ['filme', 'branded content']),
  mk(3, 'Terceiro Projeto', 'Cliente Gama', 'Agência Um', ['branding', 'design']),
  mk(4, 'Quarta Ação', 'Cliente Delta', 'Agência Três', ['digital', 'experiencial']),
  mk(5, 'Quinto Lançamento', 'Cliente Épsilon', 'Agência Dois', ['integrada', 'filme']),
];
