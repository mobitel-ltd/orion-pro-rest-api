// import * as faker from 'faker';
import * as testUtils from './fixtures/utils';
// const getEventsJSON = require('./fixtures/get-events.json');
// const getPersonsJSON = require('./fixtures/get-persons.json');
// const getPersonByTabJSON = require('./fixtures/get-person-by-tab.json');
import * as parser from '../src/parser';

describe('Test data parser', () => {
    const accessPointIdList = Array.from({ length: 5 }, () => 12345);
    const eventIdList = Array.from({ length: 5 }, () => 12345);

    let keyData: any;
    let personData: any;
    let listPersonData: any;
    let eventData: any;
    const count = 100;

    beforeEach(() => {
        keyData = testUtils.getKeyDataJSON();
        personData = testUtils.getPersonDataJSON();
        listPersonData = testUtils.getListPersonsDataJSON(count);
        eventData = testUtils.getListEventDataJSON(count, eventIdList, accessPointIdList);
    });

    it('Expect parser return list of keys', () => {
        const result = parser.allPersonHandle(listPersonData);
        const body = listPersonData[0].return.OperationResult.item[0];
        const expectedData = {
            AccessLevelId: body.AccessLevelId.$value,
            Address: body.Address.$value,
            ArchivingTimeStamp: body.ArchivingTimeStamp.$value,
            BirthDate: body.BirthDate.$value,
            Birthplace: body.Birthplace.$value,
            BlackListComment: body.BlackListComment.$value,
            ChangeTime: body.ChangeTime.$value,
            Company: body.Company.$value,
            CompanyId: body.CompanyId.$value,
            ContactIdIndex: body.ContactIdIndex.$value,
            Department: body.Department.$value,
            DepartmentId: body.DepartmentId.$value,
            DocumentEndingDate: body.DocumentEndingDate.$value,
            DocumentIsser: body.DocumentIsser.$value,
            DocumentIsserCode: body.DocumentIsserCode.$value,
            DocumentIssueDate: body.DocumentIssueDate.$value,
            DocumentNumber: body.DocumentNumber.$value,
            DocumentSerials: body.DocumentSerials.$value,
            DocumentType: body.DocumentType.$value,
            EmailList: body.EmailList.$value,
            ExternalId: body.ExternalId.$value,
            FirstName: body.FirstName.$value,
            HomePhone: body.HomePhone.$value,
            Id: body.Id.$value,
            IsDismissed: body.IsDismissed.$value,
            IsFreeShedule: body.IsFreeShedule.$value,
            IsInArchive: body.IsInArchive.$value,
            IsInBlackList: body.IsInBlackList.$value,
            IsLockedDayCrossing: body.IsLockedDayCrossing.$value,
            Itn: body.Itn.$value,
            LastName: body.LastName.$value,
            MiddleName: body.MiddleName.$value,
            Phone: body.Phone.$value,
            Position: body.Position.$value,
            PositionId: body.PositionId.$value,
            Sex: body.Sex.$value,
            Status: body.Status.$value,
            TabNum: body.TabNum.$value,
        };

        expect(result.length).toEqual(count);
        expect(result[0]).toEqual(expectedData);
    });

    it('Expect getPersonByType returns correct data', () => {
        const result = parser.personHandle(personData);
        const body = personData[0].return.OperationResult;
        const expectedData = {
            AccessLevelId: body.AccessLevelId.$value,
            Address: body.Address.$value,
            ArchivingTimeStamp: body.ArchivingTimeStamp.$value,
            BirthDate: body.BirthDate.$value,
            Birthplace: body.Birthplace.$value,
            BlackListComment: body.BlackListComment.$value,
            ChangeTime: body.ChangeTime.$value,
            Company: body.Company.$value,
            CompanyId: body.CompanyId.$value,
            ContactIdIndex: body.ContactIdIndex.$value,
            Department: body.Department.$value,
            DepartmentId: body.DepartmentId.$value,
            DocumentEndingDate: body.DocumentEndingDate.$value,
            DocumentIsser: body.DocumentIsser.$value,
            DocumentIsserCode: body.DocumentIsserCode.$value,
            DocumentIssueDate: body.DocumentIssueDate.$value,
            DocumentNumber: body.DocumentNumber.$value,
            DocumentSerials: body.DocumentSerials.$value,
            DocumentType: body.DocumentType.$value,
            EmailList: body.EmailList.$value,
            ExternalId: body.ExternalId.$value,
            FirstName: body.FirstName.$value,
            HomePhone: body.HomePhone.$value,
            Id: body.Id.$value,
            IsDismissed: body.IsDismissed.$value,
            IsFreeShedule: body.IsFreeShedule.$value,
            IsInArchive: body.IsInArchive.$value,
            IsInBlackList: body.IsInBlackList.$value,
            IsLockedDayCrossing: body.IsLockedDayCrossing.$value,
            Itn: body.Itn.$value,
            LastName: body.LastName.$value,
            MiddleName: body.MiddleName.$value,
            Phone: body.Phone.$value,
            Position: body.Position.$value,
            PositionId: body.PositionId.$value,
            Sex: body.Sex.$value,
            Status: body.Status.$value,
            TabNum: body.TabNum.$value,
        };

        expect(result).toEqual(expectedData);
    });

    it('Expect getEvents works correct', () => {
        const result = parser.getEvents(eventIdList, accessPointIdList)(eventData);
        const body = eventData[0].return.OperationResult.item.find(
            (item: any) =>
                eventIdList.includes(item.EventTypeId.$value) && accessPointIdList.includes(item.AccessPointId.$value),
        );

        const expectedEventIdItem = {
            TabNum: body.TabNum.$value,
            Description: body.Description.$value,
            EventDate: body.EventDate.$value,
            EventTypeId: body.EventTypeId.$value,
            EventId: body.EventId.$value,
            AccessPointId: body.AccessPointId.$value,
            PassMode: body.PassMode.$value,
        };

        expect(result[0]).toEqual(expectedEventIdItem);
    });

    it('Expect getCard return correct data', () => {
        const result = parser.getCard(keyData);
        const body = keyData[0].return.OperationResult;
        const expectedGetKeyData = {
            AccessLevelId: body.AccessLevelId.$value,
            EndDate: body.EndDate.$value,
            IsBlocked: body.IsBlocked.$value,
            PersonId: body.PersonId.$value,
            StartDate: body.StartDate.$value,
        };

        expect(result).toEqual(expectedGetKeyData);
    });
});
