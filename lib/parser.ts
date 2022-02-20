import {Frontmatter, Page, SimplePage} from "vuepress-plugin-custom-pages";
import {Fragment, Heading, Paragraph, UnorderedList} from "markdown-generator";
import {PathMessageResolver} from "./messages";

export interface EntityParser
{
	parse(entityCandidate: any, path: string, messageResolver: PathMessageResolver): Page
}

export type EntitySchema = {
	name?: string,
	description?: string,
	meta?: EntityMeta,
	lang?: string,
	layout?: string,
	postDescription?: string,
	fields?: Array<Field>,
	groups?: Array<FieldsGroup>
}

export type EntityMeta = {
	title?: string,
	description?: string,
	canonicalUrl?: string,
	additional?: Array<MetaItem>
}

export type MetaItem = {
	name: string,
	content: string
}

export type Field = {
	name: string,
	type: string | Function,
	values?: Array<FieldValues>,
	description?: string,
	containers?: Array<FieldContainer>
}

export type FieldValues = {
	value: string,
	description?: string
}

export type FieldContainer = {
	type: string,
	content: string
}

export type FieldsGroup = {
	name: string,
	fields: Array<Field>
}

function parseField(field: Field, messageResolver: PathMessageResolver, headingLevel: number): Array<Fragment>
{
	const fragments: Array<Fragment> = [
		new Heading(field.name, headingLevel)
	];
	
	const fieldList = new UnorderedList();
	
	if(field.type)
		fieldList.add(messageResolver.resolve('fieldType') + ' ' + '`' + field.type + '`');
	
	if(fieldList.hasItems())
		fragments.push(fieldList);
	
	if(field.description)
		fragments.push(new Paragraph(field.description));
	
	return fragments;
}

function parseFields(fields: Array<Field>, messageResolver: PathMessageResolver, headingLevel: number = 2): Array<Fragment>
{
	const fragments: Array<Fragment> = [];
	
	fields.forEach(field =>
	{
		fragments.push(...parseField(field, messageResolver, headingLevel));
	});
	
	return fragments;
}

function parseGroups(groups: Array<FieldsGroup>, messageResolver: PathMessageResolver): Array<Fragment>
{
	return [];
}

function toPage(page: SimplePage, fragments: Array<Fragment>)
{
	fragments.forEach(fragment =>
	{
		page.add(fragment)
	});
}

export class SimpleEntityParser implements EntityParser
{
	parse(entityCandidate: any | EntitySchema, path: string, messageResolver: PathMessageResolver): Page
	{
		if(typeof entityCandidate !== 'object')
			throw new Error('Entity should be object type');
		
		const name = entityCandidate.name;
		
		if(!name)
			throw new Error('Entity should have name');
		
		const frontMatter = {} as Frontmatter;
		
		if(entityCandidate.lang)
			frontMatter.lang = entityCandidate.lang;
		
		if(entityCandidate.layout)
			frontMatter.layout = entityCandidate.layout;
		
		if(entityCandidate.meta)
		{
			if(entityCandidate.meta.description)
				frontMatter.description = entityCandidate.meta.description;
			
			if(entityCandidate.meta.canonicalUrl)
				frontMatter.canonicalUrl = entityCandidate.meta.canonicalUrl;
			
			if(entityCandidate.meta.title)
				frontMatter.title = entityCandidate.meta.title;
			
			if(Array.isArray(entityCandidate.meta.additional))
				frontMatter.meta = entityCandidate.meta.additional;
		}
		
		const page = new SimplePage(name, path, frontMatter);
		
		if(entityCandidate.description)
			page.add(new Paragraph(entityCandidate.description));
		
		if(Array.isArray(entityCandidate.fields))
			toPage(page, parseFields(entityCandidate.fields, messageResolver));
		
		if(Array.isArray(entityCandidate.groups))
			toPage(page, parseGroups(entityCandidate.groups, messageResolver));
		
		if(entityCandidate.postDescription)
			page.add(new Paragraph(entityCandidate.postDescription));
		
		return page;
	}
	
}