import {Context} from '@vuepress/types';
import {glob} from 'glob';
import path from "path";
import {EntityParser, SimpleEntityParser} from "./parser";

type PluginOptions = {
	parser?: EntityParser,
}

export default (options: PluginOptions, ctx: Context) =>
{
	
	const parser = options.parser || new SimpleEntityParser();
	
	console.log(ctx.sourceDir, path.join(ctx.sourceDir, '**.entity.json'));
	const entites = glob.sync(
		path.join(ctx.sourceDir, '**', '*.entity.json')
	);
	
	console.log(entites);
	
	return {
		name: 'vuepress-plugin-entity-pages',
		
	}
}