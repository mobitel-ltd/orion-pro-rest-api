import { pick, get, map, mapValues, head, pipe, conforms, filter, includes, omit } from 'lodash/fp';
import consts from './consts';
import { PersonFullInfo } from '.';

const ignoreProperty = 'attributes';

const isIn = (arr: number[]) => (item: number) => includes(item, arr);

const isValidEvent = (eventTypes: number[], accessPoints: number[]) =>
    conforms({
        EventTypeId: isIn(eventTypes),
        AccessPointId: isIn(accessPoints),
    });

const eventsCollectionHandler = pipe([pick(consts.EVENT_KEYS_LIST), mapValues(consts.VALUE_NAME)]);

const personHandler = pipe([omit(ignoreProperty), mapValues(consts.VALUE_NAME)]);

const keyHandler = pipe([pick(consts.CARD_KEYS_LIST), mapValues(consts.VALUE_NAME)]);

export const allPersonHandle = (data: any): PersonFullInfo[] | undefined =>
    pipe([head, get(consts.PATH_TO_INFO_ARRAY), map(personHandler)])(data);

export const personHandle = (data: any): PersonFullInfo | undefined =>
    pipe([head, get(consts.PATH_TO_INFO), personHandler])(data);

export const getCard = pipe([head, get(consts.PATH_TO_INFO), keyHandler]);

export const getAllCards = pipe([head, get(consts.PATH_TO_INFO_ARRAY), map(keyHandler)]);

export const getEvents = (eventTypes: number[], accessPoints: number[]) =>
    pipe([
        head,
        get(consts.PATH_TO_INFO_ARRAY),
        map(eventsCollectionHandler),
        filter(isValidEvent(eventTypes, accessPoints)),
    ]);
