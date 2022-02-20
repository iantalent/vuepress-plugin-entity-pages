import {suite, test} from '@testdeck/mocha';
import * as chai from 'chai';
import {Heading, Paragraph, UnorderedList} from "markdown-generator";
import {Page} from "vuepress-plugin-custom-pages";
import {EntityBuilder} from "../lib/builder";

const assert = chai.assert;

@suite
class EntityPagesTests
{
	private page: Page;
	
	before()
	{
		const builder = new EntityBuilder();
		
		this.page = builder.build({
			name: 'Test entity',
			description: 'Test description',
			lang: 'ru_RU',
			layout: 'TestLayout',
			meta: {
				title: 'Test title',
				canonicalUrl: '/canonical/',
				description: 'description',
				additional: [
					{name: 'keywords', content: 'keyword'}
				]
			},
			fields: [
				{
					name: 'name',
					type: 'string'
				}
			]
		}, '/path/');
	}
	
	@test 'name'()
	{
		assert.equal(this.page.name(), 'Test entity');
		
	}
	
	@test 'path'()
	{
		assert.equal(this.page.path(), '/path/');
	}
	
	@test 'frontmatter'()
	{
		assert.deepEqual(this.page.frontmatter(), {
			title: 'Test title',
			lang: 'ru_RU',
			layout: 'TestLayout',
			canonicalUrl: '/canonical/',
			description: 'description',
			meta: [
				{
					name: 'keywords',
					content: 'keyword'
				}
			]
		});
	}
	
	@test 'tree'()
	{
		assert.deepEqual(this.page.tree(), [
			new Heading('Test entity', 1),
			new Paragraph('Test description'),
			new Heading('name', 2),
			(new UnorderedList())
				.add('Type: `string`')
		])
	}
}