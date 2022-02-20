import {EntityParser} from "./parser";
import {MessageResolver, PluginMessages} from "./messages";
import {Context} from '@vuepress/types';
import {glob} from 'glob';
import path from "path";
import {EntityBuilder} from "./builder";

type PluginOptions = {
	parser?: EntityParser,
	messageResolver?: MessageResolver,
	messages?: PluginMessages
}

export default (options: PluginOptions, ctx: Context) =>
{
	const builder = new EntityBuilder({
		parser: options.parser,
		messageResolver: options.messageResolver,
		messages: options.messages
	});
	
	console.log(ctx.sourceDir, path.join(ctx.sourceDir, '**.entity.json'));
	const entites = glob.sync(
		path.join(ctx.sourceDir, '**', '*.entity.json')
	);
	
	console.log(entites);
	
	return {
		name: 'vuepress-plugin-entity-pages',
		themeConfig: {
			locales: {
				entityPages: {
					fieldType: 'Type'
				}
			}
		}
	}
}