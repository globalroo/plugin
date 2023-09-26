module.exports = (name, capitalizedName) => `
import { expect } from 'chai'
import sinon from 'sinon'
import { ${capitalizedName}, create${capitalizedName} } from './${name}.server.mjs'

describe('${capitalizedName} Resolver', () => {
	afterEach(() => {
			sinon.restore()
	})

	describe('create${capitalizedName}', () => {
		it('should create a new ${capitalizedName}', async () => {
			const name = "TestPlugin"
			const fake${capitalizedName} = { _id: "1234:sfg20/${name}", name }
			sinon.stub(${capitalizedName}, "put").resolves(fake${capitalizedName})
			const result = await create${capitalizedName}(null, { name })

			expect(result).to.eql(fake${capitalizedName})
			expect(${capitalizedName}.put.calledOnce).to.be.true
		})

		it('should throw an error if ${capitalizedName} creation fails', async () => {
			const name = "TestPlugin"
			sinon.stub(${capitalizedName}, "put").throws(new Error("Creation Error"))
			try {
				await create${capitalizedName}(null, { name })
			} catch (error) {
				expect(error.message).to.eql(\`Error creating ${name}: Creation Error\`)
			}
		})
	})
})`
