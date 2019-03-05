const {pick, get, map, mapValues, head, pipe, conforms, filter, includes} = require('lodash/fp');
const config = require('../config.json');
const consts = require('./consts');

const isIn = arr => item => includes(item, arr);

const isValidEvent = conforms({
    EventTypeId: isIn(config.EVENT_TYPES_ID_LIST),
    AccessPointId: isIn(config.ACCESS_POINT_ID_LIST),
});

const eventsCollectionHandler = pipe([
    pick(consts.EVENT_KEYS_LIST),
    mapValues(consts.VALUE_NAME),
]);

const personHandler = keyList => pipe([
    pick(keyList),
    mapValues(consts.VALUE_NAME),
]);

module.exports = {
    getPersons: pipe([
        head,
        get(consts.PATH_TO_INFO_ARRAY),
        map(personHandler(consts.PERSON_DEFAULT_KEYS_LIST)),
    ]),

    getDefaultPersonData: pipe([
        head,
        get(consts.PATH_TO_INFO),
        personHandler(consts.PERSON_DEFAULT_KEYS_LIST),
    ]),

    getPersonDataForPutPass: pipe([
        head,
        get(consts.PATH_TO_INFO),
        personHandler(consts.PERSON_PUT_KEYS_LIST),
    ]),

    getEvents: pipe([
        head,
        get(consts.PATH_TO_INFO_ARRAY),
        map(eventsCollectionHandler),
        filter(isValidEvent),
    ]),

    getKey: pipe([
        head,
        get(consts.PATH_TO_INFO),
        pick(consts.CARD_KEYS_LIST),
        mapValues(consts.VALUE_NAME),
    ]),
};
