import { assert } from 'chai';
import {unmarshal} from './marshal';
import {MarshalSchema} from './types';

describe('unmarshal tests', () => {
  it('should unmarshal a simple object correctly', () => {
    const name = 'John Smith'
    const serialized = `{ "name": "${name}" }`

    class Person {
      name = ''
      public getName() {
        return this.name
      }
    }

    const obj = unmarshal(serialized, Person)
    assert.equal(obj.getName(), name)
  })

  it('should unmarshal a complex object correctly', () => {

    const name = 'John Smith'
    const jobTitle = 'Developer'
    const serialized = `{ "name": "${name}", "job": { "title": "${jobTitle}" } }`


    class Job {
      title = ''
      public getTitle() {
        return this.title
      }
    }

    class Person {
      name = ''
      job: Job | null = null
      public getName() {
        return this.name
      }
      public getJob() {
        return this.job
      }
    }

    const schema: MarshalSchema = {
      type: Person,
      properties: {
        job: Job,
      },
    }
    const obj = unmarshal(serialized, schema)
    assert.equal(obj.getName(), name)
    assert.equal(obj.getJob().getTitle(), jobTitle)
  })

  it('should unmarshal nested schemas correctly', () => {

    const name = 'John Smith'
    const jobTitle = 'Developer'
    const prop1 = 'foo'
    const serialized = `{ "name": "${name}", "job": { "title": "${jobTitle}", "props": { "prop1": "${prop1}" } } }`

    class JobProperties {
      prop1 = ''
      getProp1() { return this.prop1 }

    }

    class Job {
      title = ''
      props: JobProperties | null = null
      public getTitle() {
        return this.title
      }

      public getProps() { return this.props }
    }

    class Employee {
      name = ''
      job: Job | null = null
      public getName() {
        return this.name
      }
      public getJob() {
        return this.job
      }
    }

    const schema: MarshalSchema = {
      type: Employee,
      properties: {
        job: {
          type: Job,
          properties: {
            props: JobProperties
          }
        }
      },
    }
    const obj = unmarshal(serialized, schema)
    assert.equal(obj.getName(), name)
    assert.equal(obj.getJob().getTitle(), jobTitle)
    assert.equal(obj.getJob().getProps().getProp1(), prop1)
  })


  it('should unmarshal nested array schemas correctly', () => {

    const name = 'John Smith'
    const jobTitle = 'Developer'
    const friend1Name = 'Mary'
    const friend1JobTitle = 'Tester'
    const friend2Name = 'Paul'
    const friend2JobTitle = 'PO'
    const prop1 = 'foo'
    const serialized = `{ 
      "name": "${name}", 
      "job": { 
        "title": "${jobTitle}", 
        "props": { "prop1": "${prop1}" } 
      },
      "friends": [ 
        {
          "name": "${friend1Name}",
          "job": {
            "title": "${friend1JobTitle}"
          }
        },
        {
          "name": "${friend2Name}",
          "job": {
            "title": "${friend2JobTitle}"
          }
        }
      ]
    }`

    class JobProperties {
      prop1 = ''
      getProp1() { return this.prop1 }

    }

    class Job {
      title = ''
      props: JobProperties = new JobProperties()
      public getTitle() {
        return this.title
      }

      public getProps() { return this.props }
    }

    class Employee {
      name = ''
      job: Job = new Job()
      friends: Employee[] = []
      public getName() {
        return this.name
      }
      public getJob() {
        return this.job
      }
      public getFriends() {
        return this.friends
      }

      static getMarshalSchema(): MarshalSchema {
        return {
          type: Employee,
          properties: {
            job: {
              type: Job,
              properties: {
                props: JobProperties
              }
            },
            friends: {
              items: Employee
            }
          }
        }
      }
    }

    const obj = unmarshal(serialized, Employee)
    assert.equal(obj.getName(), name)
    assert.equal(obj.getJob().getTitle(), jobTitle)
    assert.equal(obj.getJob().getProps().getProp1(), prop1)
    assert.isArray(obj.getFriends())
    assert.equal(obj.getFriends().length, 2)
    assert.equal(obj.getFriends()[0].getName(), friend1Name)
    assert.equal(obj.getFriends()[0].getJob().getTitle(), friend1JobTitle)
    assert.equal(obj.getFriends()[1].getName(), friend2Name)
    assert.equal(obj.getFriends()[1].getJob().getTitle(), friend2JobTitle)
  })

})
