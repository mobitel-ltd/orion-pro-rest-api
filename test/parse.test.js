const faker = require('faker');
const testUtils = require('./fixtures/utils');
// const getEventsJSON = require('./fixtures/get-events.json');
// const getPersonsJSON = require('./fixtures/get-persons.json');
// const getPersonByTabJSON = require('./fixtures/get-person-by-tab.json');
const parser = require('../src/parser');
const assert = require('assert');

describe('Test data parser', () => {
    const accessPointIdList = Array.from({length: 5}, faker.random.number);
    const eventIdList = Array.from({length: 5}, faker.random.number);

    let keyData;
    let personData;
    let listPersonData;
    let eventData;
    const count = 100;

    beforeEach(() => {
        keyData = testUtils.getKeyDataJSON();
        personData = testUtils.getPersonDataJSON();
        listPersonData = testUtils.getListPersonsDataJSON(count);
        eventData = testUtils.getListEventDataJSON(count, eventIdList, accessPointIdList);
    });

    it('Expect parser return list of keys', () => {
        const result = parser.getPersons(listPersonData);
        const body = listPersonData[0].return.OperationResult.item[0];
        const expectedData = {
            LastName: body.LastName.$value,
            FirstName: body.FirstName.$value,
            MiddleName: body.MiddleName.$value,
            TabNum: body.TabNum.$value,
            CompanyId: body.CompanyId.$value,
            DepartmentId: body.DepartmentId.$value,
            PositionId: body.PositionId.$value,
            IsDismissed: body.IsDismissed.$value,
        };

        assert.equal(result.length, count);
        assert.deepEqual(result[0], expectedData);
    });

    it('Expect getPersonByType returns correct data', () => {
        const result = parser.getDefaultPersonData(personData);
        const body = personData[0].return.OperationResult;
        const expectedData = {
            LastName: body.LastName.$value,
            FirstName: body.FirstName.$value,
            MiddleName: body.MiddleName.$value,
            TabNum: body.TabNum.$value,
            CompanyId: body.CompanyId.$value,
            DepartmentId: body.DepartmentId.$value,
            PositionId: body.PositionId.$value,
            IsDismissed: body.IsDismissed.$value,
        };

        assert.deepEqual(result, expectedData);
    });

    it('Expect getEvents works correct', () => {
        const result = parser.getEvents(eventIdList, accessPointIdList)(eventData);
        const body = eventData[0].return.OperationResult.item.find(item =>
            eventIdList.includes(item.EventTypeId.$value) &&
            accessPointIdList.includes(item.AccessPointId.$value));

        const expectedEventIdItem = {
            TabNum: body.TabNum.$value,
            Description: body.Description.$value,
            EventDate: body.EventDate.$value,
            EventTypeId: body.EventTypeId.$value,
            EventId: body.EventId.$value,
            AccessPointId: body.AccessPointId.$value,
            PassMode: body.PassMode.$value,
        };

        assert.deepEqual(result[0], expectedEventIdItem);
    });

    it('Expect getKey return correct data', () => {
        const result = parser.getKey(keyData);
        const body = keyData[0].return.OperationResult;
        const expectedGetKeyData = {
            'AccessLevelId': body.AccessLevelId.$value,
            'EndDate': body.EndDate.$value,
            'IsBlocked': body.IsBlocked.$value,
            'PersonId': body.PersonId.$value,
            'StartDate': body.StartDate.$value,
        };

        assert.deepEqual(result, expectedGetKeyData);
    });

    it('Expect getPersonDataForPutPass return correct data', () => {
        const result = parser.getPersonDataForPutPass(personData);
        const body = personData[0].return.OperationResult;
        const expectedData = {
            LastName: body.LastName.$value,
            FirstName: body.FirstName.$value,
            MiddleName: body.MiddleName.$value,
            TabNum: body.TabNum.$value,
            CompanyId: body.CompanyId.$value,
            DepartmentId: body.DepartmentId.$value,
            PositionId: body.PositionId.$value,
            Id: body.Id.$value,
        };

        assert.deepEqual(result, expectedData);
    });
});
