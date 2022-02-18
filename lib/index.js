/**
 * @typedef {import('@rollup/pluginutils').FilterPattern} FilterPattern
 * @typedef {Omit<import('@mdx-js/mdx').CompileOptions, 'SourceMapGenerator'>} CompileOptions
 * @typedef {import('rollup').Plugin} Plugin
 *
 * @typedef RollupPluginOptions
 * @property {FilterPattern} [include]
 *   List of picomatch patterns to include
 * @property {FilterPattern} [exclude]
 *   List of picomatch patterns to exclude
 *
 * @typedef {CompileOptions & RollupPluginOptions} Options
 */

import {SourceMapGenerator} from 'source-map'
import {VFile} from 'vfile'
import {createFilter} from '@rollup/pluginutils'
import {createFormatAwareProcessors} from '@mdx-js/mdx/lib/util/create-format-aware-processors.js'
import yaml from 'js-yaml';
import remf from 'remark-frontmatter';
/**
 * Compile MDX w/ rollup.
 *
 * @param {Options} [options]
 * @return {Plugin}
 */

 async function extractyaml(src) {
  //let res = yaml.loadAll(src)[0];
  let fromMd = await import('mdast-util-from-markdown');
  let frontmatter = (await import('micromark-extension-frontmatter')).frontmatter
  let mutil = await import('mdast-util-frontmatter')

  let tree = fromMd.fromMarkdown(src, {
      extensions: [frontmatter(['yaml', 'toml'])],
      mdastExtensions: [mutil.frontmatterFromMarkdown(['yaml', 'toml'])]
  });
  let yamlextracted = (tree.children.find( e => e.type == 'yaml'));
  yamlextracted = yamlextracted == null ? "" : yamlextracted.value;
  let res = (yamlextracted).length < 1 ? {} : yaml.loadAll(yamlextracted)[0];
  return res;
}

async function getfrontmatter(vlr) {
  return JSON.stringify(await extractyaml(vlr)); 
}


export function rollup(options = {}) {
  if (typeof options.remarkPlugins === 'undefined') options.remarkPlugins = [];
  options.remarkPlugins.push(remf);

  const {include, exclude, ...rest} = options
  const {extnames, process} = createFormatAwareProcessors({
    SourceMapGenerator,
    ...rest
  })
  const filter = createFilter(include, exclude)
  return {
    name: '@mdx-js/rollup-frontmatter',
    async transform(value, path) {
      const file = new VFile({value, path})

      if (
        file.extname &&
        filter(file.path) &&
        extnames.includes(file.extname)
      ) {
        const compiled = await process(file)
        compiled.value += 'export const mdata = ' + (await getfrontmatter(value)) + ';';

        return {code: String(compiled.value), map: compiled.map}
        // V8 on Erbium.
        /* c8 ignore next 2 */
      }
    }
  }
}
