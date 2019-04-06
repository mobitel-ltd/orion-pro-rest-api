import { pick, get, map, mapValues, head, pipe, conforms, filter, includes } from 'lodash/fp';
import consts from './consts';

const isIn = (arr: number[]) => (item: number) => includes(item, arr);

const isValidEvent = (eventTypes: number[], accessPoints: number[]) =>
    conforms({
        EventTypeId: isIn(eventTypes),
        AccessPointId: isIn(accessPoints),
    });

const eventsCollectionHandler = pipe([pick(consts.EVENT_KEYS_LIST), mapValues(consts.VALUE_NAME)]);

const personHandler = (keyList: string[]) => pipe([pick(keyList), mapValues(consts.VALUE_NAME)]);

export const getPersons = pipe([
    head,
    get(consts.PATH_TO_INFO_ARRAY),
    map(personHandler(consts.PERSON_DEFAULT_KEYS_LIST)),
]);

export const getDefaultPersonData = pipe([
    head,
    get(consts.PATH_TO_INFO),
    personHandler(consts.PERSON_DEFAULT_KEYS_LIST),
]);

export const getPersonDataForPutPass = pipe([
    head,
    get(consts.PATH_TO_INFO),
    personHandler(consts.PERSON_PUT_KEYS_LIST),
]);

export const getEvents = (eventTypes: number[], accessPoints: number[]) =>
    pipe([
        head,
        get(consts.PATH_TO_INFO_ARRAY),
        map(eventsCollectionHandler),
        filter(isValidEvent(eventTypes, accessPoints)),
    ]);

export const getKey = pipe([head, get(consts.PATH_TO_INFO), pick(consts.CARD_KEYS_LIST), mapValues(consts.VALUE_NAME)]);
