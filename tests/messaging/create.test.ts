import { defaultAfterAll, defaultAfterEach, defaultBeforeAll, defaultBeforeEach, haveNoAdditionalKeys } from "../utilities/setup";
import { EntStateDatabase } from "../../src/database/EntStateDatabase";
import { Db, MongoClient, ObjectId } from "mongodb";
import { BaseSchema } from "@uems/uemscommlib";
import { TopicDatabase } from "../../src/database/TopicDatabase";
import { StateDatabase } from "../../src/database/StateDatabase";
import Intentions = BaseSchema.Intentions;

const empty = <T extends Intentions>(intention: T): { msg_intention: T, msg_id: 0, status: 0, userID: string } => ({
    msg_intention: intention,
    msg_id: 0,
    status: 0,
    userID: 'user',
})

describe('create messages of states', () => {
    let client!: MongoClient;
    let db!: Db;

    beforeAll(async () => {
        const { client: newClient, db: newDb } = await defaultBeforeAll();
        client = newClient;
        db = newDb;
    });
    afterAll(() => defaultAfterAll(client, db));
    beforeEach(() => defaultBeforeEach([], client, db));
    afterEach(() => defaultAfterEach(client, db));

    describe('ent state', () => {
        let entStateDB: EntStateDatabase;

        beforeAll(() => {
            entStateDB = new EntStateDatabase(db, {
                changelog: 'changelog',
                details: 'details',
            });
        })

        it('basic create inserts into the database', async () => {
            const result = await entStateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            const query = await entStateDB.query({ ...empty('READ') });
            expect(query).toHaveLength(1);
            expect(query[0].name).toEqual('name');
            expect(haveNoAdditionalKeys(query[0], ['name', 'icon', 'color', 'id']));
        });

        it('should not include additional properties in creating records', async () => {
            const result = await entStateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                // @ts-ignore
                addProp: 'one',
                something: 'else',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            const query = await entStateDB.query({ ...empty('READ') });
            expect(query).toHaveLength(1);
            expect(query[0].name).toEqual('name');
            expect(haveNoAdditionalKeys(query[0], ['name', 'icon', 'color', 'id']));
        });

        it('should reject creation of duplicate state names', async () => {
            const result = await entStateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            await expect(entStateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
            })).rejects.toThrowError('duplicate ent state');
        });
    });

    describe('topics', () => {
        let topicsDB: TopicDatabase;

        beforeAll(() => {
            topicsDB = new TopicDatabase(db, {
                changelog: 'changelog',
                details: 'details',
            });
        })

        it('basic create inserts into the database', async () => {
            const result = await topicsDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                description: 'description',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            const query = await topicsDB.query({ ...empty('READ') });
            expect(query).toHaveLength(1);
            expect(query[0].name).toEqual('name');
            expect(haveNoAdditionalKeys(query[0], ['name', 'icon', 'color', 'id', 'description']));
        });

        it('should not include additional properties in creating records', async () => {
            const result = await topicsDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                description: 'topic',
                // @ts-ignore
                addProp: 'one',
                something: 'else',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            const query = await topicsDB.query({ ...empty('READ') });
            expect(query).toHaveLength(1);
            expect(query[0].name).toEqual('name');
            expect(haveNoAdditionalKeys(query[0], ['name', 'icon', 'color', 'id', 'description']));
        });

        it('should reject creation of duplicate state names', async () => {
            const result = await topicsDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                // @ts-ignore
                addProp: 'one',
                something: 'else',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            await expect(topicsDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                description: '',
            })).rejects.toThrowError('duplicate topic');
        });
    });

    describe('state', () => {
        let stateDB: StateDatabase;

        beforeAll(() => {
            stateDB = new StateDatabase(db, {
                changelog: 'changelog',
                details: 'details',
            });
        })

        it('basic create inserts into the database', async () => {
            const result = await stateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            const query = await stateDB.query({ ...empty('READ') });
            expect(query).toHaveLength(1);
            expect(query[0].name).toEqual('name');
            expect(haveNoAdditionalKeys(query[0], ['name', 'icon', 'color', 'id']));
        });

        it('should not include additional properties in creating records', async () => {
            const result = await stateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                // @ts-ignore
                addProp: 'one',
                something: 'else',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            const query = await stateDB.query({ ...empty('READ') });
            expect(query).toHaveLength(1);
            expect(query[0].name).toEqual('name');
            expect(haveNoAdditionalKeys(query[0], ['name', 'icon', 'color', 'id']));
        });

        it('should reject creation of duplicate state names', async () => {
            const result = await stateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
            });

            expect(result).toHaveLength(1);
            expect(typeof (result[0]) === 'string').toBeTruthy();
            expect(ObjectId.isValid(result[0])).toBeTruthy();

            await expect(stateDB.create({
                ...empty('CREATE'),
                name: 'name',
                icon: 'icon',
                color: 'color',
                // @ts-ignore
                addProp: 'one',
                something: 'else',
            })).rejects.toThrowError('duplicate state');
        });
    });

    describe('all', () => {
        let stateDB: StateDatabase;
        let topicDB: TopicDatabase;
        let entStateDB: EntStateDatabase;

        beforeAll(() => {
            stateDB = new StateDatabase(db, {
                changelog: 'changelog',
                details: 'details',
            });
            topicDB = new TopicDatabase(db, {
                changelog: 'changelog',
                details: 'details',
            });
            entStateDB = new EntStateDatabase(db, {
                changelog: 'changelog',
                details: 'details',
            });
        })

        it('should allow topic, state and ent state of the same name', async () => {
            const stateCreate = await stateDB.create({ ...empty('CREATE'), name: 'duplicate', icon: '', color: '' });
            const entCreate = await entStateDB.create({ ...empty('CREATE'), name: 'duplicate', icon: '', color: '' });
            const topicCreate = await topicDB.create({
                ...empty('CREATE'),
                name: 'duplicate',
                icon: '',
                color: '',
                description: ''
            });

            expect(stateCreate).toHaveLength(1);
            expect(entCreate).toHaveLength(1);
            expect(topicCreate).toHaveLength(1);
            expect(ObjectId.isValid(stateCreate[0])).toBeTruthy();
            expect(ObjectId.isValid(entCreate[0])).toBeTruthy();
            expect(ObjectId.isValid(topicCreate[0])).toBeTruthy();
        });
    })

});
