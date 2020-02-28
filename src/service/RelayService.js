import {
    Environment,
    Network,
    RecordSource,
    Store,
    QueryResponseCache,
} from 'relay-runtime';

const serverHost = "https://nodejs.e-pasar.id/graphql";
// console.log('serverHost', serverHost);

const cache = new QueryResponseCache({ size: 100, ttl: 100000 });

const fetchQuery = async (operation, variables, cacheConfig) => {
    //http://taiki-t.hatenablog.com/entry/2017/09/05/181931
    let queryId = operation.name;
    // console.log('fetchQuery operation.name', operation.name);
    let cachedData = cache.get(queryId, variables);

    // console.log('fetchQuery', operation, variables);
    // console.log('fetchQuery', queryId, cachedData);

    // Handle force option in RefetchOptions
    // See: https://facebook.github.io/relay/docs/pagination-container.html
    // https://facebook.github.io/relay/docs/refetch-container.html
    const forceLoad = cacheConfig && cacheConfig.force;

    if (!forceLoad && cachedData) {
        return cachedData;
    }

    if (forceLoad) {
        // clear() means to reset all the cache, not only the entry addressed by specific queryId.
        // See blog comments for more details.
        cache.clear();
    }

    const token = null;
    let auth = '';
    if (token) {
        auth = token;
    }

    let response = await fetch(`${serverHost}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Wallex-App': 'wallex-app-payment',
            'Authorization': auth
        },
        credentials: 'include',
        body: JSON.stringify({
            query: operation.text,
            variables,
        }),
    });

    let data = await response.json();


    cache.set(queryId, variables, data);
    return data;
};

const modernEnvironment = new Environment({
    network: Network.create(fetchQuery),
    store: new Store(new RecordSource()),
});

export default class RelayService {

    static get environment() {
        return modernEnvironment;
    }

    static get clientMutationId() {
        return AppUtil.clientMutationId();
    }
}
