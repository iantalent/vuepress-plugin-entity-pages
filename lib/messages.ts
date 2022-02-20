export type MessageValue = string | ((path: string) => string)

export type PluginMessages = {
	[key: string]: MessageValue
}

export interface MessageResolver
{
	add(messages: PluginMessages): void
	
	resolve(message: string, path: string): string;
}

export function resolveMessage(value: MessageValue, path: string): any
{
	return value && value instanceof Function ? value.call(null, path) : value;
}

export class SimpleMessageResolver implements MessageResolver
{
	private messagesContainer: PluginMessages = {};
	
	add(messages: PluginMessages): void
	{
		this.messagesContainer = Object.assign({}, this.messagesContainer, messages);
	}
	
	resolve(message: string, path: string): string
	{
		return resolveMessage(this.messagesContainer[message], path) || '';
	}
}

export class PathMessageResolver
{
	constructor(private readonly resolver: MessageResolver, private readonly path: string)
	{
	}
	
	resolve(message: string)
	{
		return this.resolver.resolve(message, this.path) || '';
	}
}