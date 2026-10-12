import sanityCli from 'sanity/cli';

const { getCliClient } = sanityCli;
const client = getCliClient({ apiVersion: '2024-10-01', useCdn: false });
const applyChanges = process.env.SANITY_MIGRATION_APPLY === '1';
const legacyFields = ['blocks', 'closing', 'crew', 'stats'];

function portableBlock(key, text, style = 'normal') {
  return {
    _key: key,
    _type: 'block',
    style,
    markDefs: [],
    children: [{ _key: `${key}-span`, _type: 'span', text, marks: [] }],
  };
}

function portableImage(item, key, layout = item.layout || 'wide') {
  const { image, _key, _type, fullWidth, ...fields } = item;
  return {
    ...(image && typeof image === 'object' ? image : {}),
    ...fields,
    _key: key,
    _type: 'image',
    layout: fullWidth === false ? 'content' : layout,
  };
}

function migrateVideos(videos = []) {
  return videos.map((item) => {
    if (item?.video?.asset) return item;
    if (!item?.asset) return item;
    return {
      _key: item._key,
      _type: 'videoStory',
      title: '',
      video: { _type: 'file', asset: item.asset },
      body: [],
    };
  });
}

function migrateBody(project) {
  const body = (project.body ?? []).map((item) =>
    item?._type === 'figure' ? portableImage(item, item._key) : item,
  );
  const keys = new Set(body.map((item) => item?._key).filter(Boolean));
  let generatedKey = 0;

  function uniqueKey(preferred) {
    let key = preferred || `legacy-${generatedKey++}`;
    while (keys.has(key)) key = `legacy-${generatedKey++}`;
    keys.add(key);
    return key;
  }

  for (const item of project.blocks ?? []) {
    if (!item || typeof item !== 'object') continue;
    const key = uniqueKey(item._key);
    if (item._type === 'textBlock' && item.text) {
      body.push(portableBlock(key, item.text));
    } else if (item._type === 'imageBlock') {
      body.push(portableImage(item, key, item.fullWidth === false ? 'content' : 'wide'));
    } else if (item._type === 'videoBlock') {
      const { _key, _type, background, ...fields } = item;
      body.push({ ...fields, _key: key, _type: 'video' });
    } else if (item._type === 'figure') {
      body.push(portableImage(item, key));
    } else if (['block', 'image', 'gallery', 'video', 'cards'].includes(item._type)) {
      body.push({ ...item, _key: key });
    } else {
      const text = typeof item.text === 'string' ? item.text : JSON.stringify(item);
      body.push(portableBlock(key, text || ''));
    }
  }

  const stats = (project.stats ?? []).filter((item) => item?.label || item?.value);
  if (stats.length) {
    body.push(portableBlock(uniqueKey(), 'Resultados', 'h2'));
    for (const item of stats) {
      body.push(portableBlock(uniqueKey(), [item.label, item.value].filter(Boolean).join(': ')));
    }
  }

  const crew = (project.crew ?? []).filter((item) => item?.role || item?.names?.length);
  if (crew.length) {
    body.push(portableBlock(uniqueKey(), 'Equipe', 'h2'));
    for (const item of crew) {
      const names = Array.isArray(item.names) ? item.names.join(', ') : item.names;
      body.push(portableBlock(uniqueKey(), [item.role, names].filter(Boolean).join(': ')));
    }
  }

  if (project.closing) {
    body.push(portableBlock(uniqueKey(), project.closing, 'blockquote'));
  }

  return body;
}

const projects = await client.fetch(
  `*[_type == "project" && (defined(blocks) || defined(closing) || defined(crew) || defined(stats) || count(body[_type == "figure"]) > 0 || count(videos[_type != "videoStory"]) > 0)]{
    _id, body, blocks, closing, crew, stats, videos
  }`,
);

if (!projects.length) {
  console.log('Nenhum documento com campos antigos foi encontrado.');
} else {
  for (const project of projects) {
    const body = migrateBody(project);
    const videos = migrateVideos(project.videos);
    console.log(`${applyChanges ? 'Migrando' : 'Prévia'} ${project._id}: ${body.length} blocos e ${videos.length} vídeos`);
    if (applyChanges) {
      await client
        .patch(project._id)
        .set({ body, videos })
        .unset(legacyFields)
        .commit();
    }
  }

  if (!applyChanges) {
    console.log('Prévia concluída. Para gravar, defina SANITY_MIGRATION_APPLY=1 e rode novamente.');
  }
}