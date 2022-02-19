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
			meta: {
				title: 'Test title'
			}
		}, '/path/');
	}
	
	@test 'simple page name'()
	{
		assert.equal(this.page.name(), 'Test entity');
		
	}
	
	@test 'simple page path'()
	{
		assert.equal(this.page.path(), '/path/');
	}
	
	@test 'advance page'()
	{
		assert.deepEqual(this.page.tree(), [
			new Heading('Test entity', 1),
			new Paragraph('Test description')
		])
	}
}