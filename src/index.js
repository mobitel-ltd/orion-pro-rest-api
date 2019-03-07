/* eslint new-cap: ["error", { "properties": false }]*/
const soapLib = require('soap');
const parser = require('./parser');

/**
    * @typedef {Object} Logger logger
    * @property {Function} debug debug log
    * @property {Function} info info log
    * @property {Function} warn warn log
    * @property {Function} error error log
    */

/**
 * Api for getting user data from Orion system
 * @class
 * @classdesc API to work with soap protocol and Orion safe service
 */
class OrionApi {
    /**
     * @param {Object} options options
     * @param {!String} options.url url to connect to server
     * @param {Logger} [options.logger=console] logger like winston, JS console by default
     * @param {soapLib} [options.lib=soapLib] lib to work with soap, by default is https://github.com/vpulim/node-soap
     */
    constructor({url, logger = console, lib = soapLib}) {
        this.logger = logger;
        this.url = url;
        this.lib = lib;
    }

    /**
     * Start Orion service
     * @async
     * @private
     * @returns {Promise<Object>} soap client instance
     */
    async _start() {
        const client = await this.lib.createClientAsync(this.url);
        this.logger.info('Connected to Orion!!!');
        this.client = client;

        return client;
    }

    /**
     * Person object for adding to DB
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
     * @async
     * @param {Object} [options={}] options for request
     * @param {Number} options.count=0 count by default is 0
     * @param {Number} options.offset=0 offset by default is 0
     * @param {Boolean} options.withoutPhoto=true don't get foto, true by default
     * @returns {Promise<Array.<Person>>} collection of all persons
     */
    async getPersons(options = {}) {
        try {
            const client = this.client || await this._start();
            const data = await client.GetPersonsAsync({count: 0, offset: 0, withoutPhoto: true, ...options});
            this.logger.debug('Request for getting person info is succeded!!!');

            return parser.getPersons(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * TPersonData from Orion docs
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
     * Get person info by tab number
     * @async
     * @param {Object} options options for request
     * @param {String} options.tabNum person number
     * @param {Boolean} [options.withoutPhoto=true] don't get foto, true by default
     * @param {('getDefaultPersonData'|'getPersonDataForPutPass')} [parseType='getDefaultPersonData'] parse way
     * @returns {Promise<Person|TPersonData>} Person info by tab number, depending on parse typing, Person by default parser
     */
    async getPersonByTabNumber({tabNum, withoutPhoto = true}, parseType = 'getDefaultPersonData') {
        try {
            const client = this.client || await this._start();
            const data = await client.GetPersonByTabNumberAsync({tabNum, withoutPhoto});
            this.logger.debug(`Request for getting info about person by tub number ${tabNum} is succeded!!!`);

            return parser[parseType](data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * @typedef {Object} EventData person info
     * @property {String} Description event description
     * @property {String} EventDate date of event
     * @property {Number} EventTypeId event types id
     * @property {String} EventId event id
     * @property {Number} AccessPointId access point id
     // TODO add limit of events
     * @property {Number} PassMode pass mode
    */

    /**
     * Get collections with all events from server by params and with expected properties
     * @async
     * @param {Object} options options for request
     * @param {String} options.beginTime strart ISO 8601 time of getting events
     * @param {String} options.endTime end ISO 8601 time of getting events
     * @param {Number[]} [options.accessPoints=[]] access points to check
     * @param {Number[]} [options.eventTypes=[]] events types id to check
     * @param {Number} [options.offset=0] offset by default is 0
     * @param {Number} [options.count=0] count by default is 0
     * @returns {Promise<Array.<EventData>>} collection
     */
    async getEvents({beginTime, endTime, accessPoints = [], eventTypes = [], offset = 0, count = 0}) {
        try {
            const client = this.client || await this._start();
            const data = await client.GetEventsAsync({beginTime, endTime, offset, count});
            this.logger.debug(`Get events from ${beginTime} till ${endTime} is succeded for events:`, eventTypes);

            return parser.getEvents(eventTypes, accessPoints)(data);
        } catch (err) {
            this.logger.error(err);
        }
    }

    /**
     * @typedef {Object} CardData card info
     * @property {Number} AccessLevelId card access level id
     * @property {Boolean} IsBlocked is card blocked
     * @property {Number} PersonId card owner id
     * @property {Date} StartDate date of start using card
     * @property {Date} EndDate date of end using card
    */

    /**
     * @async Get key information
     * @param {Object} options options for request
     * @param {String} options.cardNo card id of person
     * @returns {Promise<CardData>} collection
     */
    async getKey(options) {
        try {
            const client = this.client || await this._start();
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
     * @async
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
            const client = this.client || await this._start();
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
     * @param {String} options.cardNo card number
     * @returns {Promise<Boolean>} result of request
     */
    async deletePass(options) {
        try {
            const client = this.client || await this._start();
            const data = await client.DeletePassAsync(options);
            this.logger.debug('Removing data access for card number %s is succeded!!!', options.cardNo);

            return data;
            // return parser.deletePass(data);
        } catch (err) {
            this.logger.error(err);
        }
    }
}

module.exports = OrionApi;
