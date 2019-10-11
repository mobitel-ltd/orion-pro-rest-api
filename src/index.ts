/* eslint new-cap: ["error", { "properties": false }]*/
import * as Soap from 'soap';
import * as parser from './parser';
import { pick, isEmpty } from 'lodash';
import consts from './consts';

export interface PersonFullInfo {
    Id: number;
    LastName: string;
    FirstName: string;
    MiddleName: string;
    BirthDate: string;
    Company: string;
    Department: string;
    Position: string;
    CompanyId: number;
    DepartmentId: number;
    PositionId: number;
    TabNum: string;
    Phone?: number;
    HomePhone?: number;
    Address?: string;
    AccessLevelId: number;
    Status: number;
    ContactIdIndex: number;
    IsLockedDayCrossing: boolean;
    IsFreeShedule: boolean;
    ExternalId?: number;
    IsInArchive: boolean;
    DocumentType: number;
    DocumentSerials?: string;
    DocumentNumber?: number;
    DocumentIssueDate: string;
    DocumentEndingDate: string;
    DocumentIsser?: string;
    DocumentIsserCode?: string;
    Sex: number;
    Birthplace?: string;
    EmailList?: string[];
    ArchivingTimeStamp: string;
    IsInBlackList: boolean;
    IsDismissed: boolean;
    BlackListComment?: string;
    ChangeTime: string;
    Itn?: string;
}

export interface EventData {
    TabNum: string;
    Description: string;
    EventDate: string;
    EventTypeId: number;
    EventId: string;
    AccessPointId: number;
    // TODO add limit of events
    PassMode: number;
}

export interface CardData {
    AccessLevelId: number;
    IsBlocked: boolean;
    PersonId: number;
    StartDate: string;
    EndDate: string;
}

export interface PutPersonData {
    Id: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    CompanyId: number;
    DepartmentId: number;
    TabNum: string;
    PositionId: number;
}

export interface EventOptions {
    /* ISO 8601 time of getting events */
    beginTime: string;
    /* ISO 8601 time of getting events */
    endTime: string;
    accessPoints?: number[];
    eventTypes?: number[];
    offset?: number;
    count?: number;
}

export interface PersonOptions {
    tabNum: string;
    withoutPhoto?: boolean;
}

export interface PutPass {
    cardNo: string;
    tabNum: string;
    dateBegin: string;
    dateEnd: string;
    defaultAccessLevel: number;
}

type LogFunction = (arg: any) => void;

export interface Logger {
    log: LogFunction;
    warn: LogFunction;
    error: LogFunction;
    debug: LogFunction;
}

export class OrionApi {
    private client: any | undefined;

    constructor(private url: string, public logger: Logger = console, private lib = Soap) {}

    private async start(): Promise<Soap.Client> {
        const client = await this.lib.createClientAsync(this.url);
        this.logger.log('Connected to Orion!!!');
        this.client = client;

        return client;
    }

    async getPersons(
        options: {
            count?: number;
            offset?: number;
            withoutPhoto?: boolean;
        } = {},
    ): Promise<PersonFullInfo[] | undefined> {
        try {
            const client = this.client || (await this.start());
            const data = await client.GetPersonsAsync({
                count: 0,
                offset: 0,
                withoutPhoto: true,
                ...options,
            });
            this.logger.debug('Request for getting person info is succeded!!!');

            return parser.allPersonHandle(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    async getPersonByTabNumber(options: PersonOptions): Promise<PersonFullInfo | undefined> {
        try {
            const client = this.client || (await this.start());
            this.logger.debug(`Start request for getting info about person by tub number ${options.tabNum}`);
            const data = await client.GetPersonByTabNumberAsync({
                withoutPhoto: true,
                ...options,
            });
            this.logger.debug(`Request for getting info about person by tub number ${options.tabNum} is succeded!!!`);

            return parser.personHandle(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    async getPersonByPersonId(id: number): Promise<PersonFullInfo | undefined> {
        const persons = await this.getPersons();

        return persons && persons.find(person => person.Id === id);
    }

    async getPersonForPutCard(options: PersonOptions): Promise<PutPersonData | undefined> {
        const data = await this.getPersonByTabNumber(options);

        return data && (pick(data, consts.PERSON_PUT_KEYS_LIST) as PutPersonData);
    }

    async getEvents(options: EventOptions): Promise<EventData[] | undefined> {
        const { beginTime, endTime, offset = 0, count = 0, accessPoints = [], eventTypes = [] } = options;
        const client = this.client || (await this.start());
        const data = await client.GetEventsAsync({
            beginTime,
            endTime,
            offset,
            count,
        });
        this.logger.debug(
            `Get events from ${beginTime} till ${endTime} is succeded for events: ${JSON.stringify(eventTypes)}`,
        );

        return parser.getEvents(eventTypes, accessPoints)(data);
    }

    async getCard(options: { cardNo: string }): Promise<CardData | undefined> {
        try {
            const client = this.client || (await this.start());
            const data = await client.GetKeyDataAsync(options);
            this.logger.debug(`Get info about card by cardno ${options.cardNo} is succeded!!!`);
            const parsedData = parser.getCard(data);
            if (isEmpty(parsedData)) {
                this.logger.debug(`No user use card ${options.cardNo}`);

                return;
            }

            return parsedData;
        } catch (err) {
            this.logger.error(err);
        }
    }

    async getAllCards(): Promise<CardData[]> {
        const client = this.client || (await this.start());
        const data = await client.GetKeysAsync();

        return parser.getAllCards(data);
    }

    async getPersonAccessId(tabNum: string, personData?: PutPersonData): Promise<number | undefined> {
        try {
            const person = personData || (await this.getPersonByTabNumber({ tabNum }));
            if (!person) {
                return;
            }
            const allCards = await this.getAllCards();
            const personCardData = allCards.find(card => card.PersonId === person.Id);

            return personCardData && personCardData.AccessLevelId;
        } catch (err) {
            this.logger.error(err);
        }
    }

    async putPass({ tabNum, defaultAccessLevel, ...options }: PutPass): Promise<boolean> {
        try {
            const client = this.client || (await this.start());
            const personData = await this.getPersonForPutCard({ tabNum });
            const personAccessLevelId = await this.getPersonAccessId(tabNum, personData);
            const accessLevels = {
                AccessLevel: {
                    Id: personAccessLevelId || defaultAccessLevel,
                },
            };
            const params = {
                ...options,
                personData,
                accessLevels,
            };
            // this data is Person
            const data = await client.PutPassWithAccLevelsAsync(params);
            this.logger.debug(`Setting access for user ${tabNum} to card ${options.cardNo} is succeded!!!`);

            return !!data;
        } catch (err) {
            this.logger.error(err);

            return false;
        }
    }

    async deletePass(options: { cardNo: string }): Promise<boolean> {
        try {
            const client = this.client || (await this.start());
            // this data is Person
            const data = await client.DeletePassAsync(options);
            this.logger.debug(`Removing data access for card number ${options.cardNo} is succeded!!!`);

            return !!data;
        } catch (err) {
            this.logger.error(err);

            return false;
        }
    }
}
