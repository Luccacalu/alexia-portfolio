import type { BodyBlock, Project, Settings } from './types';
import { inheritMeta, withPaths } from './paths';

export const sampleSettings: Settings = {
  siteTitle: 'NOME SOBRENOME',
  description: 'Portfólio de copywriting de Nome Sobrenome.',
  firstName: 'NOME',
  lastName: 'SOBRENOME',
  role: 'Copywriter',
  heroIntro:
    'Sou redator publicitário.\nPalavras certas, no lugar certo.\nE com um pouco de ousadia.',
  beginLead: 'Alguns começam pelo trabalho.\nOutros, pelas pessoas.\nEntão, diga:',
  beginQuestion: 'Por onde você quer começar?',
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

let key = 0;
const k = () => `k${(key++).toString(36)}`;

const span = (text: string, marks: string[] = []) => ({
  _key: k(),
  _type: 'span' as const,
  text,
  marks,
});

const p = (text: string): BodyBlock => ({
  _key: k(),
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [span(text)],
});

const h = (style: 'h2' | 'h3', text: string): BodyBlock => ({
  _key: k(),
  _type: 'block',
  style,
  markDefs: [],
  children: [span(text)],
});

const quote = (text: string): BodyBlock => ({
  _key: k(),
  _type: 'block',
  style: 'blockquote',
  markDefs: [],
  children: [span(text)],
});

const figure = (layout: 'content' | 'wide' | 'full' = 'wide'): BodyBlock => ({
  _key: k(),
  _type: 'figure',
  url: '',
  alt: 'Imagem de exemplo',
  caption: 'Substitua por uma imagem do projeto.',
  layout,
});

const colors = ['#ef9bc0', '#ffd84d', '#ff7a59', '#8ec5ff', '#f2efe9'];

type Draft = Omit<Project, 'path'>;

const articleBody = (): BodyBlock[] => [
  p('Este é um artigo de exemplo. No Sanity, o corpo é um editor rico: você escreve, formata, e encaixa imagens, vídeos e cards na ordem que fizer sentido para a história.'),
  h('h2', 'O desafio'),
  p('Descreva o briefing, o contexto da marca e o que precisava mudar. Textos longos, listas e citações cabem aqui sem campos rígidos.'),
  quote('Uma frase que resume a ideia — ou um trecho do filme, da peça, do manifesto.'),
  figure('wide'),
  h('h3', 'A solução'),
  p('Explique a virada criativa. Use negrito e itálico no painel. Insira um vídeo do Vimeo ou YouTube quando a peça pedir movimento.'),
  figure('full'),
  p('Feche com o que aconteceu depois: resultado, desdobramentos, ou simplesmente o que você quer que a pessoa sinta ao sair da página.'),
];

const roots: Draft[] = [
  {
    slug: 'projeto-exemplo-1',
    title: 'Primeira Campanha',
    client: 'Cliente Alfa',
    agency: 'Agência Um',
    year: '2025',
    coverUrl: '',
    cardColor: colors[0],
    categories: ['digital', 'integrada'],
    lede: 'Uma ideia que começou num briefing apertado e ganhou o mundo em três formatos.',
    body: articleBody(),
  },
  {
    slug: 'projeto-exemplo-2',
    title: 'Segunda Ideia',
    client: 'Cliente Beta',
    agency: 'Agência Dois',
    year: '2025',
    coverUrl: '',
    cardColor: colors[1],
    categories: ['filme', 'branded content'],
    lede: 'Um filme, um manifesto e um convite para olhar de novo.',
    body: articleBody(),
  },
  {
    slug: 'projeto-exemplo-3',
    title: 'Terceiro Projeto',
    client: 'Cliente Gama',
    agency: 'Agência Um',
    year: '2024',
    coverUrl: '',
    cardColor: colors[2],
    categories: ['branding', 'design'],
    body: articleBody(),
  },
  {
    slug: 'projeto-exemplo-4',
    title: 'Quarta Ação',
    client: 'Cliente Delta',
    agency: 'Agência Três',
    year: '2024',
    coverUrl: '',
    cardColor: colors[3],
    categories: ['digital', 'experiencial'],
    body: articleBody(),
  },
  {
    slug: 'projeto-exemplo-5',
    title: 'Quinto Lançamento',
    client: 'Cliente Épsilon',
    agency: 'Agência Dois',
    year: '2023',
    coverUrl: '',
    cardColor: colors[4],
    categories: ['integrada', 'filme'],
    body: articleBody(),
  },
];

const nested: Draft[] = [
  {
    slug: 'bastidores',
    parentSlug: 'projeto-exemplo-1',
    title: 'Bastidores',
    client: '',
    coverUrl: '',
    cardColor: colors[1],
    categories: [],
    lede: 'Como a campanha foi feita — do rascunho à rua.',
    body: [
      p('Páginas internas são artigos iguais aos da listagem: texto livre, mídia e, se quiser, mais cards para um nível ainda mais fundo.'),
      h('h2', 'Processo'),
      p('Conte o making of, mostre referências, publique o roteiro. Nada disso precisa de um campo especial no CMS.'),
      figure('wide'),
    ],
  },
  {
    slug: 'pecas',
    parentSlug: 'projeto-exemplo-1',
    title: 'Peças',
    client: '',
    coverUrl: '',
    cardColor: colors[2],
    categories: [],
    lede: 'O desdobramento em filme, digital e rua.',
    body: [
      p('Use esta página para agrupar formatos. Cada peça pode ter o próprio artigo mais abaixo na hierarquia.'),
      figure('full'),
    ],
  },
  {
    slug: 'stills',
    parentSlug: 'bastidores',
    title: 'Stills',
    client: '',
    coverUrl: '',
    cardColor: colors[3],
    categories: [],
    body: [
      p('Terceiro nível da hierarquia. Da listagem você entra no projeto, depois nos bastidores, depois aqui.'),
      {
        _key: k(),
        _type: 'gallery',
        images: [
          { url: '', alt: 'Still 1', caption: 'Cena 01' },
          { url: '', alt: 'Still 2', caption: 'Cena 02' },
        ],
      },
    ],
  },
];

export const sampleAllProjects: Project[] = inheritMeta(withPaths([...roots, ...nested]));
export const sampleProjects: Project[] = sampleAllProjects.filter((p) => !p.parentSlug);
