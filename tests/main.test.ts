import {suite, test} from '@testdeck/mocha';
import * as chai from 'chai';
import {SimpleEntityParser} from "../lib/parser";
import {Heading, Paragraph} from "markdown-generator";
import {Page} from "vuepress-plugin-custom-pages";

const assert = chai.assert;

@suite
class EntityPagesTests
{
	private page: Page;
	
	before()
	{
		const parser = new SimpleEntityParser();
		
		this.page = parser.parse({
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
			}
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
			new Paragraph('Test description')
		])
	}
}