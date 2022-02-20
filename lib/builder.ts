import {EntityParser, SimpleEntityParser} from "./parser";
import {MessageResolver, PathMessageResolver, PluginMessages, SimpleMessageResolver} from "./messages";
import {Page} from "vuepress-plugin-custom-pages";

export type BuilderOptions = {
	parser?: EntityParser,
	messageResolver?: MessageResolver,
	messages?: PluginMessages
}

const defaultMessages = {
	fieldType: 'Type:'
};

export class EntityBuilder
{
	private readonly parser: EntityParser;
	private readonly messageResolver: MessageResolver;
	
	constructor(options?: BuilderOptions)
	{
		const safeOptions = options || {};
		this.parser = safeOptions.parser || new SimpleEntityParser();
		this.messageResolver = safeOptions.messageResolver || new SimpleMessageResolver();
		this.messageResolver.add(Object.assign({}, defaultMessages, safeOptions.messages));
	}
	
	build(entity: any, path: string): Page
	{
		if(typeof entity !== 'object')
			throw new Error('Entity should be object type');
		
		return this.parser.parse(entity, path, new PathMessageResolver(this.messageResolver, path));
	}
}