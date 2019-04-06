import * as faker from 'faker';

const ITEMTYPE = 'READER';
const SECTIONID = faker.random.number();
const COMPORTNUMBER = faker.random.number();
const PKUADDRESS = faker.random.number();
const COMPUTERID = faker.random.number();

const getRandomArrayMix = (arr: any) =>
    faker.random.arrayElement([...arr, ...Array.from({ length: 5 }, faker.random.number)]);

const getEventData = (eventIdList: any, accessPointIdList: any) => (val: any, index: number) => ({
    attributes: {
        id: (index + 1).toString(),
        'xsi:type': 'NS2:TEvent',
    },
    EventId: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: `{${faker.random.uuid().toUpperCase()}}`,
    },
    EventTypeId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: getRandomArrayMix(eventIdList),
    },
    EventDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '2019-03-02T21:09:40.000Z',
    },
    Description: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.random.words(),
    },
    ComputerId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: COMPUTERID,
    },
    ComPortNumber: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: COMPORTNUMBER,
    },
    PKUAddress: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: PKUADDRESS,
    },
    DevAddress: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    ZoneAddress: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    AccessPointId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: getRandomArrayMix(accessPointIdList),
    },
    AccessPointName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.random.word(),
    },
    AccessZoneId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: -1,
    },
    PassMode: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.arrayElement([1, 2]),
    },
    CardNo: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.random.alphaNumeric(16).toUpperCase(),
    },
    PersonId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    LastName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.lastName(),
    },
    FirstName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.firstName(),
    },
    MiddleName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.firstName(),
    },
    BirthDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '1899-12-29T22:01:00.000Z',
    },
    TabNum: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.random.number(),
    },
    ItemType: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: ITEMTYPE,
    },
    SectionId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: SECTIONID,
    },
});

const getTPersonData = () => ({
    attributes: {
        id: '2',
        'xsi:type': 'NS2:TPersonData',
    },
    Id: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    LastName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.lastName(),
    },
    FirstName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.firstName(),
    },
    MiddleName: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.firstName(),
    },
    BirthDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '1899-12-29T22:01:00.000Z',
    },
    Company: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.company.companyName(),
    },
    Department: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.jobTitle(),
    },
    Position: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.name.jobType(),
    },
    CompanyId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    DepartmentId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    PositionId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    TabNum: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.random.number().toString(),
    },
    Phone: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    HomePhone: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    Address: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    AccessLevelId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    Status: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    ContactIdIndex: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    IsLockedDayCrossing: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: faker.random.boolean(),
    },
    IsFreeShedule: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: faker.random.boolean(),
    },
    ExternalId: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    IsInArchive: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: false,
    },
    DocumentType: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    DocumentSerials: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    DocumentNumber: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    DocumentIssueDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '1899-12-29T22:01:00.000Z',
    },
    DocumentEndingDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '1899-12-29T22:01:00.000Z',
    },
    DocumentIsser: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    DocumentIsserCode: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    Sex: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: 0,
    },
    Birthplace: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    EmailList: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    ArchivingTimeStamp: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '1899-12-29T22:01:00.000Z',
    },
    IsInBlackList: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: false,
    },
    IsDismissed: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: false,
    },
    BlackListComment: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
    ChangeTime: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '2017-09-12T13:05:32.000Z',
    },
    Itn: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
    },
});

const getKeyData = () => ({
    attributes: {
        id: '2',
        'xsi:type': 'NS2:TKeyData',
    },
    CodeType: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    Code: {
        attributes: {
            'xsi:type': 'xsd:string',
        },
        $value: faker.random.alphaNumeric(16).toUpperCase(),
    },
    PersonId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    AccessLevelId: {
        attributes: {
            'xsi:type': 'xsd:int',
        },
        $value: faker.random.number(),
    },
    StartDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '2011-12-01T21:00:00.000Z',
    },
    EndDate: {
        attributes: {
            'xsi:type': 'xsd:dateTime',
        },
        $value: '2020-01-01T20:59:59.000Z',
    },
    IsBlocked: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: false,
    },
    IsStoreInDevice: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: true,
    },
    IsStoreInS2000: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: false,
    },
    IsInStopList: {
        attributes: {
            'xsi:type': 'xsd:boolean',
        },
        $value: false,
    },
});

export const getPersonDataJSON = () => [
    {
        return: {
            attributes: {
                id: '1',
                'xsi:type': 'NS2:TOperationResultPersonData',
            },
            Success: {
                attributes: {
                    'xsi:type': 'xsd:boolean',
                },
                $value: true,
            },
            OperationResult: getTPersonData(),
        },
    },
    'Very big xml',
    null,
    'XML info',
];

export const getListPersonsDataJSON = (count: any) => [
    {
        return: {
            attributes: {
                id: '1',
                'xsi:type': 'NS2:TOperationResultPersons',
            },
            Success: {
                attributes: {
                    'xsi:type': 'xsd:boolean',
                },
                $value: true,
            },
            OperationResult: {
                attributes: {
                    'xsi:type': 'SOAP-ENC:Array',
                    'SOAP-ENC:arrayType': `NS2:TPersonData[${count}]`,
                },
                item: Array.from({ length: count }, getTPersonData),
            },
        },
    },
    'Very big xml',
    null,
    'XML info',
];

export const getKeyDataJSON = () => [
    {
        return: {
            attributes: {
                id: '1',
                'xsi:type': 'NS2:TOperationResultKeyData',
            },
            Success: {
                attributes: {
                    'xsi:type': 'xsd:boolean',
                },
                $value: true,
            },
            OperationResult: getKeyData(),
        },
    },
    'Very big xml',
    null,
    'XML info',
];

export const getListEventDataJSON = (count: any, eventIdList: any, accessPointIdList: any) => [
    {
        return: {
            attributes: {
                id: '1',
                'xsi:type': 'NS2:TOperationResultEvents',
            },
            Success: {
                attributes: {
                    'xsi:type': 'xsd:boolean',
                },
                $value: true,
            },
            OperationResult: {
                attributes: {
                    'xsi:type': 'SOAP-ENC:Array',
                    'SOAP-ENC:arrayType': `NS2:TEvent[${count}]`,
                },
                item: Array.from({ length: count }, getEventData(eventIdList, accessPointIdList)),
            },
        },
    },
    'Very big xml',
    null,
    'XML info',
];
