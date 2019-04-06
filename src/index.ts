/* eslint new-cap: ["error", { "properties": false }]*/
import * as Soap from 'soap';
import * as parser from './parser';

export interface EventData {
    Description: string;
    EventDate: string;
    EventTypeId: Number;
    EventId: string;
    AccessPointId: Number;
    // TODO add limit of events
    PassMode: Number;
}

export interface CardData {
    AccessLevelId: number;
    IsBlocked: boolean;
    PersonId: number;
    StartDate: string;
    EndDate: string;
}

export interface Person {
    LastName: string;
    FirstName: string;
    MiddleName: string;
    TabNum: string;
    IsDismissed: Boolean;
    CompanyId: Number;
    DepartmentId: Number;
    PositionId: Number;
}

export interface TPersonData {
    Id: Number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    CompanyId: Number;
    DepartmentId: Number;
    TabNum: string;
    PositionId: Number;
}

export type ParseType = 'getDefaultPersonData' | 'getPersonDataForPutPass';

export interface GetEventsOptions {
    /* ISO 8601 time of getting events */
    beginTime: string;
    /* ISO 8601 time of getting events */
    endTime: string;
    accessPoints?: number[];
    eventTypes?: number[];
    offset?: number;
    count?: number;
}

export interface GetPersonByTabNumber {
    tabNum: string;
    withoutPhoto?: boolean;
}

export interface TAccessLevel {
    Id: string;
}

export interface PutPass {
    cardNo: string;
    tabNum: string;
    // TODO add access level depending on current level of user in system
    accessLevels: TAccessLevel[];
    dateBegin: string;
    dateEnd: string;
}

export class OrionApi {
    url: string;
    logger: Console = console;
    lib: any = Soap;
    private client: any | undefined;

    constructor(url: string, logger = console, lib = Soap) {
        this.url = url;
        this.logger = logger;
        this.lib = lib;
    }

    private async start(): Promise<Soap.Client> {
        const client = await this.lib.createClientAsync(this.url);
        this.logger.info('Connected to Orion!!!');
        this.client = client;

        return client;
    }

    /**
     * get person info about selected users
     */
    async getPersons(options?: {
        count: number;
        offset: number;
        withoutPhoto: boolean;
    }): Promise<Person[] | undefined> {
        try {
            const { count = 0, offset = 0, withoutPhoto = true } = options || {};
            const client = this.client || (await this.start());
            const data = await client.GetPersonsAsync({
                count: 0,
                offset: 0,
                withoutPhoto: true,
                ...options,
            });
            this.logger.debug('Request for getting person info is succeded!!!');

            return parser.getPersons(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Get person info by tab number
     */
    async getPersonByTabNumber(options: GetPersonByTabNumber, parseType: ParseType = 'getDefaultPersonData') {
        try {
            const client = this.client || (await this.start());
            const data = await client.GetPersonByTabNumberAsync({
                withoutPhoto: true,
                ...options,
            });
            this.logger.debug(`Request for getting info about person by tub number ${options.tabNum} is succeded!!!`);

            return parser[parseType](data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Get collections with all events from server by params and with expected properties
     */
    async getEvents(options: GetEventsOptions): Promise<EventData[] | undefined> {
        try {
            const { beginTime, endTime, offset = 0, count = 0, accessPoints = [], eventTypes = [] } = options;
            const client = this.client || (await this.start());
            const data = await client.GetEventsAsync({
                beginTime,
                endTime,
                offset,
                count,
            });
            this.logger.debug(`Get events from ${beginTime} till ${endTime} is succeded for events:`, eventTypes);

            return parser.getEvents(eventTypes, accessPoints)(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * @async Get key information
     */
    async getKey(options: { cardNo: string }): Promise<CardData | undefined> {
        try {
            const client = this.client || (await this.start());
            const data = await client.GetKeyDataAsync(options);
            this.logger.debug('Get info about card by cardno %s is succeded!!!', options.cardNo);

            return parser.getKey(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**  Set accsess for user by card with limit of time */
    async putPass({ tabNum, ...options }: PutPass): Promise<boolean> {
        try {
            const client = this.client || (await this.start());
            const personData = await this.getPersonByTabNumber({ tabNum }, 'getPersonDataForPutPass');
            // TODO add access level depending on current level of user in system
            const defaultAccessOptions = {
                AccessLevel: {
                    Id: 311,
                },
            };
            const params = {
                ...options,
                personData,
                accessLevels: defaultAccessOptions,
            };
            const data = await client.PutPassWithAccLevelsAsync(params);
            this.logger.debug('Setting access for user %s to card %s is succeded!!!', tabNum, options.cardNo);

            return data;
            // return parser.putPass(data);
        } catch (err) {
            this.logger.error(err);

            return false;
        }
    }

    /**
     * Remove card access
     * @returns {Promise<Boolean>} result of request
     */
    async deletePass(options: { cardNo: string }): Promise<boolean> {
        try {
            const client = this.client || (await this.start());
            const data = await client.DeletePassAsync(options);
            this.logger.debug('Removing data access for card number %s is succeded!!!', options.cardNo);

            return data;
            // return parser.deletePass(data);
        } catch (err) {
            this.logger.error(err);

            return false;
        }
    }
}
