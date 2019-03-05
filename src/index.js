/* eslint new-cap: ["error", { "properties": false }]*/
const soap = require('soap');
const parser = require('./parser');
const getLogger = require('./log');

const defaultConfig = {
    type: 'both',
    filePath: 'logs/service',
    fileLevel: 'silly',
    consoleLevel: 'debug',
};

module.exports = class {
    /**
     * API to work with soap protocol and Orion safe service
     * @param {String} url url to connect to server
     * @param {Object} loggerConfig=defaultConfig winston loggerConfig
     * @param {('both'|'console')} loggerConfig.type type to stdout
     * @param {String} loggerConfig.filePath path to log file
     * @param {('silly'|'console'|'debug'|'info'|'error')} loggerConfig.fileLevel level to write logs in file
     * @param {('silly'|'console'|'debug'|'info'|'error')} loggerConfig.consoleLevel level to write logs in console
     * @param {lib} lib=soap lib to work with soap, by default is soap
     */
    constructor(url, loggerConfig = defaultConfig, lib = soap) {
        this.logger = getLogger(loggerConfig, 'Orion-request-service');
        this.url = url;
        this.lib = lib;
    }

    /**
     * Start Orion service
     * @returns {Promise<Object>} soap client instance
     */
    async start() {
        const client = await this.lib.createClientAsync(this.url);
        this.logger.info('Connected to Orion!!!');
        this.client = client;

        return client;
    }

    /**
     * @typedef {Object} TPersonData person info
     * @property {Number} Id check if user is in system
     * @property {String} FirstName person firstname
     * @property {String} MiddleName person middlename
     * @property {String} LastName person lastname
     * @property {Number} CompanyId inner id of company
     * @property {Number} DepartmentId inner id of department
     * @property {String} TabNum person tab num
     * @property {Number} PositionId inner id of position in the company
     */

    /**
     * @typedef {Object} Person person info
     * @property {String} LastName person lastname
     * @property {String} FirstName person firstname
     * @property {String} MiddleName person middlename
     * @property {String} TabNum person tab num
     * @property {Boolean} IsDismissed check if user is in system
     * @property {Number} CompanyId inner id of company
     * @property {Number} DepartmentId inner id of department
     * @property {Number} PositionId inner id of position in the company
     */

    /**
     * get person info about selected users
     * @param {Object} options={} options for request
     * @param {Number} options.count=0 count by default is 0
     * @param {Number} options.offset=0 offset by default is 0
     * @param {Boolean} options.withoutPhoto=true don't get foto, true by default
     * @returns {Promise<Array.<Person>>} collection of all persons
     */
    async getPersons(options = {}) {
        try {
            const client = this.client || await this.start();
            const data = await client.GetPersonsAsync({count: 0, offset: 0, withoutPhoto: true, ...options});
            this.logger.debug('Request for getting person info is succeded!!!');

            return parser.getPersons(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Get person info by tab number
     * @param {Object} options options for request
     * @param {String} options.tabNum person number
     * @param {Boolean} options.withoutPhoto=true don't get foto, true by default
     * @param {('getDefaultPersonData'|'getPersonDataForPutPass')} parseType='getDefaultPersonData' parse way
     * @returns {Promise<Person|TPersonData>} Person info by tab number, depending on parse typing
     */
    async getPersonByTabNumber({tabNum, withoutPhoto = true}, parseType = 'getDefaultPersonData') {
        try {
            const client = this.client || await this.start();
            const data = await client.GetPersonByTabNumberAsync({tabNum, withoutPhoto});
            this.logger.debug(`Request for getting info about person by tub number ${tabNum} is succeded!!!`);

            return parser[parseType](data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Get events from server by params and parser them using config filter params
     * @param {Object} options options for request
     * @param {String} options.beginTime strart ISO 8601 time of getting events
     * @param {String} options.endTime end ISO 8601 time of getting events
     * @param {String[]|undefined} options.eventTypes=[] events types
     * @param {Number|undefined} options.offset=0 offset by default is 0
     * @param {Number|undefined} options.count=0 count by default is 0
     * @returns {Promise<Array.<{Description: String, EventDate: String, EventTypeId: Number, EventId: String, AccessPointId: Number, PassMode: Number}>>} collection
     */
    async getEvents({beginTime, endTime, eventTypes = [], offset = 0, count = 0}) {
        try {
            const client = this.client || await this.start();
            const data = await client.GetEventsAsync({beginTime, endTime, eventTypes, offset, count});
            this.logger.debug(`Get events from ${beginTime} till ${endTime} is succeded for events:`, eventTypes);

            return parser.getEvents(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Get key information
     * @param {Object} options options for request
     * @param {String} options.cardNo card id of person
     * @returns {Promise<{AccessLevelId: Number, IsBlocked: Boolean, PersonId: Number, StartDate: Date, EndDate: Date}>} collection
     */
    async getKey(options) {
        try {
            const client = this.client || await this.start();
            const data = await client.GetKeyDataAsync(options);
            this.logger.debug('Get info about card by cardno %s is succeded!!!', options.cardNo);

            return parser.getKey(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * @typedef {Object} TAccessLevel access level object
     * @property {Id} Id unique id for accessing in the system
     */

    /**
     * Set accsess for user by card with limit of time
     * @param {Object} options options for request
     * @param {String} options.cardNo card number to set
     * @param {String} options.tabNum person number
    // TODO add access level depending on current level of user in system
     * @param {Array<TAccessLevel>} [options.accessLevels] access level object
     * @param {String} options.dateBegin date to start using card
     * @param {String} options.dateEnd date to end using card
     * @returns {Promise<Boolean>} result of operation
     */
    async putPass({tabNum, ...options}) {
        try {
            const client = this.client || await this.start();
            const personData = await this.getPersonByTabNumber({tabNum}, 'getPersonDataForPutPass');
            // TODO add access level depending on current level of user in system
            const defaultAccessOptions = {
                AccessLevel: {
                    Id: 311,
                },
            };
            const params = {...options, personData, accessLevels: defaultAccessOptions};
            const data = await client.PutPassWithAccLevelsAsync(params);
            this.logger.debug('Setting access for user %s to card %s is succeded!!!', tabNum, options.cardNo);

            return data;
            // return parser.putPass(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * Remove card access
     * @async
     * @param {Object} options request options
     * @param {String} options.CardNo card number
     * @returns {Promise<Boolean>} result of request
     */
    async deletePass(options) {
        try {
            const client = this.client || await this.start();
            const data = await client.DeletePassAsync(options);
            this.logger.debug('Removing data access for card number %s is succeded!!!', options.cardNo);

            return data;
            // return parser.deletePass(data);
        } catch (err) {
            this.logger.error(err);
        }
    }
};
