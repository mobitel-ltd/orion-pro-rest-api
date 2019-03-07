const {pick, get, map, mapValues, head, pipe, conforms, filter, includes} = require('lodash/fp');
const consts = require('./consts');

const isIn = arr => item => includes(item, arr);

const isValidEvent = (eventTypes, accessPoints) => conforms({
    EventTypeId: isIn(eventTypes),
    AccessPointId: isIn(accessPoints),
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

    getEvents: (eventTypes, accessPoints) => pipe([
        head,
        get(consts.PATH_TO_INFO_ARRAY),
        map(eventsCollectionHandler),
        filter(isValidEvent(eventTypes, accessPoints)),
    ]),

    getKey: pipe([
        head,
        get(consts.PATH_TO_INFO),
        pick(consts.CARD_KEYS_LIST),
        mapValues(consts.VALUE_NAME),
    ]),
};
